import { Share, ShareContent, Platform } from 'react-native';
import Toast from 'react-native-toast-message';

type ShareType = 'text' | 'url' | 'image' | 'file';

interface ShareOptions {
  dialogTitle?: string;
  subject?: string;
  tintColor?: string;
  excludedActivityTypes?: string[];
}

interface ShareResult {
  success: boolean;
  activityType?: string;
  dismissed?: boolean;
  error?: any;
}

/**
 * Shares content based on the specified type
 * @param type The type of content to share
 * @param content The content to share
 * @param options Additional share options
 * @returns A promise that resolves to the share result
 */
export async function share(
  type: ShareType,
  content: string | string[],
  options: ShareOptions = {}
): Promise<ShareResult> {
  try {
    // Format content based on type
    let formattedContent = Array.isArray(content) ? content.join('\n') : content;

    if (Platform.OS === 'web') {
      return await shareOnWeb(type, formattedContent, options);
    } else {
      return await shareOnNative(type, formattedContent, options);
    }
  } catch (error) {
    console.error('Error sharing:', error);
    return { success: false, error };
  }
}

/**
 * Web share implementation using Web Share API or fallback
 */
async function shareOnWeb(type: ShareType, content: string, options: ShareOptions): Promise<ShareResult> {
  // Check if Web Share API is available and can share the content
  if (navigator.share) {
    try {
      const shareData: ShareData = {};

      switch (type) {
        case 'text':
          shareData.text = content;
          if (options.subject) {
            shareData.title = options.subject;
          }
          break;
        case 'url':
          shareData.url = content;
          if (options.subject) {
            shareData.title = options.subject;
          }
          break;
        case 'image':
        case 'file':
          shareData.url = content;
          if (options.subject) {
            shareData.title = options.subject;
          }
          break;
        default:
          shareData.text = content;
      }

      // Check if the data can be shared before attempting to share
      if (navigator.canShare && !navigator.canShare(shareData)) {
        console.log('Cannot share this data, falling back to clipboard');
        return await fallbackWebShare(type, content, options);
      }

      await navigator.share(shareData);
      return { success: true };
    } catch (error: any) {
      console.log('Web Share API error:', error);
      if (error.name === 'AbortError') {
        return { success: false, dismissed: true };
      }
      // If Web Share API fails, fall back to clipboard
      console.log('Web Share API failed, falling back to clipboard');
      return await fallbackWebShare(type, content, options);
    }
  } else {
    // Fallback for browsers without Web Share API
    console.log('Web Share API not available, using fallback');
    return await fallbackWebShare(type, content, options);
  }
}

/**
 * Fallback web share implementation using clipboard and other methods
 */
async function fallbackWebShare(type: ShareType, content: string, options: ShareOptions): Promise<ShareResult> {
  try {
    if (type === 'url' || type === 'text') {
      // Try to copy to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(content);
        console.log('Content copied to clipboard');
        Toast.show({
          type: 'success',
          text1: 'Copied to clipboard',
          text2: 'Shopping list copied successfully',
        });
        return { success: true };
      } else {
        // fuck android web
        try {
          const textArea = document.createElement('textarea');
          textArea.value = content;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);

          if (successful) {
            Toast.show({
              type: 'success',
              text1: 'Copied to clipboard',
              text2: 'Shopping list copied successfully',
            });
            return { success: true };
          } else {
            throw new Error('execCommand failed');
          }
        } catch (execError) {
          Toast.show({
            type: 'error',
            text1: 'Cannot copy to clipboard',
            text2: 'Please copy the text manually',
          });
          return { success: false, error: new Error('Clipboard not supported') };
        }
      }
    } else {
      // For images and files, open in new tab
      window.open(content, '_blank');
      return { success: true };
    }
  } catch (error) {
    console.error('Fallback share failed:', error);
    return { success: false, error };
  }
}

/**
 * Native share implementation using React Native's Share API
 */
async function shareOnNative(type: ShareType, content: string, options: ShareOptions): Promise<ShareResult> {
  const shareContent: ShareContent = {
    message: content,
  };

  switch (type) {
    case 'text':
      shareContent.message = content;
      break;
    case 'url':
      shareContent.url = content;
      break;
    case 'image':
      shareContent.url = content; // For image URI
      break;
    case 'file':
      shareContent.url = content; // For file URI
      break;
    default:
      shareContent.message = content;
  }

  // Note: React Native's ShareContent doesn't have a subject property
  // The subject is passed in the options parameter to Share.share()
  const shareOptions: any = {
    dialogTitle: options.dialogTitle,
    tintColor: options.tintColor,
    excludedActivityTypes: options.excludedActivityTypes,
  };

  // Add subject for platforms that support it (iOS)
  if (options.subject && Platform.OS === 'ios') {
    shareOptions.subject = options.subject;
  }

  const result = await Share.share(shareContent, shareOptions);

  if (result.action === Share.sharedAction) {
    if (result.activityType) {
      console.log('Shared with activity:', result.activityType);
      return { success: true, activityType: result.activityType };
    } else {
      console.log('Shared!');
      return { success: true };
    }
  } else if (result.action === Share.dismissedAction) {
    console.log('Share sheet dismissed');
    return { success: false, dismissed: true };
  }

  return { success: false };
}
