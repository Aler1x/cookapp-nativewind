import { BookOpen, ChefHat, CookingPot } from 'lucide-react-native';
import { Pressable } from 'react-native'
import { View } from '~/components/ui/view'
import { Text } from '~/components/ui/text'
import { ChatFeature } from '~/types/chat'

interface ChatWhatICanProps {
  onClose: () => void;
}

export default function ChatWhatICan({ onClose }: ChatWhatICanProps) {

  const options: ChatFeature[] = [
    {
      id: 1,
      icon: <BookOpen className='w-5 h-5 text-primary' />,
      label: 'Recipes',
      description: 'Find recipes for you',
    },
    {
      id: 2,
      icon: <CookingPot className='w-5 h-5 text-primary' />,
      label: 'Create',
      description: 'Create a recipe for you',
    },
    {
      id: 3,
      icon: <ChefHat className='w-5 h-5 text-primary' />,
      label: 'Answer questions',
      description: 'Ask me anything about recipes',
    },
  ]

  return (
    <Pressable className='flex-1 justify-end bg-black/50' onPress={onClose}>
      <Pressable className='bg-background rounded-t-2xl p-6 w-full max-h-[80%] shadow-2xl' onPress={() => {}}>
        {/* Header */}
        <View className='flex-row items-center justify-center mb-6'>
          <Text className='text-2xl font-bold text-foreground flex-1 text-center'>
            What can I do for you?
          </Text>
        </View>

        {/* Options */}
        <View className='gap-3'>
          {options.map((option) => (
            <View 
              key={option.id} 
              className='bg-card rounded-xl p-4 border border-border shadow-sm active:scale-[0.98] transition-transform'
            >
              <View className='flex-row items-center'>
                {/* Icon container */}
                <View className='p-3 rounded-xl bg-primary/10 mr-4'>
                  {option.icon}
                </View>
                
                {/* Content */}
                <View className='flex-1'>
                  <Text className='text-lg font-semibold text-foreground mb-1'>
                    {option.label}
                  </Text>
                  <Text className='text-sm text-muted-foreground leading-relaxed'>
                    {option.description}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </Pressable>
    </Pressable>
  )
}
