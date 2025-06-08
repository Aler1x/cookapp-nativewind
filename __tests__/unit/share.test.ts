import { share } from '~/lib/share';
import { Platform } from 'react-native';

// Mock dependencies
const mockShare = jest.fn();
const mockToastShow = jest.fn();

jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
  Share: {
    share: mockShare,
    sharedAction: 'sharedAction',
    dismissedAction: 'dismissedAction',
  },
}));

jest.mock('react-native-toast-message', () => ({
  show: mockToastShow,
}));

// Mock global navigator for web tests
const mockNavigatorShare = jest.fn();
const mockNavigatorCanShare = jest.fn();
const mockNavigatorClipboardWriteText = jest.fn();
const mockDocumentExecCommand = jest.fn();
const mockWindowOpen = jest.fn();

// Store original values
const originalNavigator = (global as any).navigator;
const originalDocument = (global as any).document;
const originalWindow = (global as any).window;

describe('Share Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset Platform.OS
    Platform.OS = 'ios' as any;

    // Reset navigator mock
    (global as any).navigator = {
      share: mockNavigatorShare,
      canShare: mockNavigatorCanShare,
      clipboard: {
        writeText: mockNavigatorClipboardWriteText,
      },
    };

    // Reset document mock
    (global as any).document = {
      createElement: jest.fn().mockReturnValue({
        value: '',
        style: {},
        focus: jest.fn(),
        select: jest.fn(),
      }),
      body: {
        appendChild: jest.fn(),
        removeChild: jest.fn(),
      },
      execCommand: mockDocumentExecCommand,
    };

    // Reset window mock
    (global as any).window = {
      open: mockWindowOpen,
    };
  });

  afterAll(() => {
    // Restore original values
    (global as any).navigator = originalNavigator;
    (global as any).document = originalDocument;
    (global as any).window = originalWindow;
  });

  describe('Native Platform Sharing', () => {
    beforeEach(() => {
      Platform.OS = 'ios' as any;
    });

    it('shares text content successfully', async () => {
      mockShare.mockResolvedValue({
        action: 'sharedAction',
        activityType: 'com.apple.UIKit.activity.Message',
      });

      const result = await share('text', 'Hello World');

      expect(mockShare).toHaveBeenCalledWith(
        { message: 'Hello World' },
        expect.objectContaining({
          dialogTitle: undefined,
          tintColor: undefined,
          excludedActivityTypes: undefined,
        })
      );
      expect(result).toEqual({
        success: true,
        activityType: 'com.apple.UIKit.activity.Message',
      });
    });

    it('shares URL content successfully', async () => {
      mockShare.mockResolvedValue({
        action: 'sharedAction',
      });

      const result = await share('url', 'https://example.com');

      expect(mockShare).toHaveBeenCalledWith({ url: 'https://example.com' }, expect.any(Object));
      expect(result).toEqual({ success: true });
    });

    it('shares array content by joining with newlines', async () => {
      mockShare.mockResolvedValue({
        action: 'sharedAction',
      });

      const result = await share('text', ['Line 1', 'Line 2', 'Line 3']);

      expect(mockShare).toHaveBeenCalledWith({ message: 'Line 1\nLine 2\nLine 3' }, expect.any(Object));
      expect(result).toEqual({ success: true });
    });

    it('handles share dismissal', async () => {
      mockShare.mockResolvedValue({
        action: 'dismissedAction',
      });

      const result = await share('text', 'Test');

      expect(result).toEqual({
        success: false,
        dismissed: true,
      });
    });

    it('includes subject for iOS', async () => {
      Platform.OS = 'ios' as any;
      mockShare.mockResolvedValue({ action: 'sharedAction' });

      await share('text', 'Test', { subject: 'My Subject' });

      expect(mockShare).toHaveBeenCalledWith(
        { message: 'Test' },
        expect.objectContaining({
          subject: 'My Subject',
        })
      );
    });

    it('excludes subject for Android', async () => {
      Platform.OS = 'android' as any;
      mockShare.mockResolvedValue({ action: 'sharedAction' });

      await share('text', 'Test', { subject: 'My Subject' });

      expect(mockShare).toHaveBeenCalledWith(
        { message: 'Test' },
        expect.not.objectContaining({
          subject: expect.anything(),
        })
      );
    });

    it('handles share options correctly', async () => {
      mockShare.mockResolvedValue({ action: 'sharedAction' });

      await share('text', 'Test', {
        dialogTitle: 'Share Test',
        tintColor: '#ff0000',
        excludedActivityTypes: ['com.apple.UIKit.activity.Print'],
      });

      expect(mockShare).toHaveBeenCalledWith(
        { message: 'Test' },
        expect.objectContaining({
          dialogTitle: 'Share Test',
          tintColor: '#ff0000',
          excludedActivityTypes: ['com.apple.UIKit.activity.Print'],
        })
      );
    });

    it('handles native share errors', async () => {
      const error = new Error('Share failed');
      mockShare.mockRejectedValue(error);

      const result = await share('text', 'Test');

      expect(result).toEqual({
        success: false,
        error,
      });
    });
  });

  describe('Web Platform Sharing', () => {
    beforeEach(() => {
      Platform.OS = 'web' as any;
    });

    it('uses Web Share API when available', async () => {
      mockNavigatorShare.mockResolvedValue(undefined);

      const result = await share('text', 'Hello Web');

      expect(mockNavigatorShare).toHaveBeenCalledWith({
        text: 'Hello Web',
      });
      expect(result).toEqual({ success: true });
    });

    it('includes title when subject is provided', async () => {
      mockNavigatorShare.mockResolvedValue(undefined);

      await share('url', 'https://example.com', { subject: 'Check this out' });

      expect(mockNavigatorShare).toHaveBeenCalledWith({
        url: 'https://example.com',
        title: 'Check this out',
      });
    });

    it('checks canShare before sharing', async () => {
      mockNavigatorCanShare.mockReturnValue(false);
      mockNavigatorClipboardWriteText.mockResolvedValue(undefined);

      await share('text', 'Test');

      expect(mockNavigatorCanShare).toHaveBeenCalled();
      expect(mockNavigatorClipboardWriteText).toHaveBeenCalledWith('Test');
    });

    it('handles Web Share API abort error', async () => {
      const abortError = new Error('User cancelled');
      abortError.name = 'AbortError';
      mockNavigatorShare.mockRejectedValue(abortError);

      const result = await share('text', 'Test');

      expect(result).toEqual({
        success: false,
        dismissed: true,
      });
    });

    it('falls back to clipboard when Web Share API fails', async () => {
      const error = new Error('Share failed');
      mockNavigatorShare.mockRejectedValue(error);
      mockNavigatorClipboardWriteText.mockResolvedValue(undefined);

      const result = await share('text', 'Test');

      expect(mockNavigatorClipboardWriteText).toHaveBeenCalledWith('Test');
      expect(mockToastShow).toHaveBeenCalledWith({
        type: 'success',
        text1: 'Copied to clipboard',
        text2: 'Shopping list copied successfully',
      });
      expect(result).toEqual({ success: true });
    });

    it('falls back to execCommand when clipboard API not available', async () => {
      // Remove Web Share API
      (global as any).navigator.share = undefined;
      (global as any).navigator.clipboard = undefined;

      const textArea = {
        value: '',
        style: {},
        focus: jest.fn(),
        select: jest.fn(),
      };
      (global as any).document.createElement.mockReturnValue(textArea);
      mockDocumentExecCommand.mockReturnValue(true);

      const result = await share('text', 'Test execCommand');

      expect((global as any).document.createElement).toHaveBeenCalledWith('textarea');
      expect(textArea.value).toBe('Test execCommand');
      expect(mockDocumentExecCommand).toHaveBeenCalledWith('copy');
      expect(result).toEqual({ success: true });
    });

    it('handles execCommand failure', async () => {
      (global as any).navigator.share = undefined;
      (global as any).navigator.clipboard = undefined;
      mockDocumentExecCommand.mockReturnValue(false);

      const result = await share('text', 'Test');

      expect(mockToastShow).toHaveBeenCalledWith({
        type: 'error',
        text1: 'Cannot copy to clipboard',
        text2: 'Please copy the text manually',
      });
      expect(result.success).toBe(false);
    });

    it('opens files in new tab', async () => {
      (global as any).navigator.share = undefined;

      const result = await share('file', 'https://example.com/file.pdf');

      expect(mockWindowOpen).toHaveBeenCalledWith('https://example.com/file.pdf', '_blank');
      expect(result).toEqual({ success: true });
    });

    it('opens images in new tab', async () => {
      (global as any).navigator.share = undefined;

      const result = await share('image', 'https://example.com/image.jpg');

      expect(mockWindowOpen).toHaveBeenCalledWith('https://example.com/image.jpg', '_blank');
      expect(result).toEqual({ success: true });
    });
  });

  describe('Share Types', () => {
    beforeEach(() => {
      Platform.OS = 'ios' as any;
      mockShare.mockResolvedValue({ action: 'sharedAction' });
    });

    it('handles text type correctly', async () => {
      await share('text', 'Sample text');

      expect(mockShare).toHaveBeenCalledWith({ message: 'Sample text' }, expect.any(Object));
    });

    it('handles url type correctly', async () => {
      await share('url', 'https://example.com');

      expect(mockShare).toHaveBeenCalledWith({ url: 'https://example.com' }, expect.any(Object));
    });

    it('handles image type correctly', async () => {
      await share('image', 'file://path/to/image.jpg');

      expect(mockShare).toHaveBeenCalledWith({ url: 'file://path/to/image.jpg' }, expect.any(Object));
    });

    it('handles file type correctly', async () => {
      await share('file', 'file://path/to/document.pdf');

      expect(mockShare).toHaveBeenCalledWith({ url: 'file://path/to/document.pdf' }, expect.any(Object));
    });

    it('defaults to text for unknown types', async () => {
      await share('unknown' as any, 'Unknown content');

      expect(mockShare).toHaveBeenCalledWith({ message: 'Unknown content' }, expect.any(Object));
    });
  });

  describe('Error Handling', () => {
    it('catches and returns errors', async () => {
      const error = new Error('General error');
      Platform.OS = 'ios' as any;
      mockShare.mockRejectedValue(error);

      const result = await share('text', 'Test');

      expect(result).toEqual({
        success: false,
        error,
      });
    });

    it('handles clipboard write errors on web', async () => {
      Platform.OS = 'web' as any;
      (global as any).navigator.share = undefined;

      const clipboardError = new Error('Clipboard access denied');
      mockNavigatorClipboardWriteText.mockRejectedValue(clipboardError);

      const result = await share('text', 'Test');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
