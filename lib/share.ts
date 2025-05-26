import { Share, ShareContent } from 'react-native';

type ShareType = 'text' | 'url' | 'image' | 'file';

interface ShareOptions {
  dialogTitle?: string;
  subject?: string;
  tintColor?: string;
  excludedActivityTypes?: string[];
}

/**
 * Shares content based on the specified type
 * @param type The type of content to share
 * @param content The content to share
 * @param options Additional share options
 * @returns A promise that resolves to the share result
 */
export async function share(type: ShareType, content: string | string[], options: ShareOptions = {}) {
  try {
    const shareContent: ShareContent = undefined;

    // Format content based on type
    if (Array.isArray(content)) {
      content = content.join('\n');
    }

    switch (type) {
      case 'text':
        shareContent.message = content as string;
        break;
      case 'url':
        shareContent.url = content as string;
        break;
      case 'image':
        shareContent.url = content as string; // For image URI
        break;
      case 'file':
        shareContent.url = content as string; // For file URI
        break;
      default:
        shareContent.message = content as string;
    }

    // Add optional subject if provided
    if (options.subject) {
      shareContent.subject = options.subject;
    }

    const result = await Share.share(shareContent, {
      dialogTitle: options.dialogTitle,
      tintColor: options.tintColor,
      excludedActivityTypes: options.excludedActivityTypes,
    });

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
  } catch (error) {
    console.error('Error sharing:', error);
    return { success: false, error };
  }
}
