import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { BackHandler } from "react-native"
import Toast from "react-native-toast-message"

export const useExitOnTwoBack = () => {
  const router = useRouter()
  const [backPressCount, setBackPressCount] = useState(0)

  useEffect(() => {
    let backPressTimeout: NodeJS.Timeout | null = null

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (backPressCount === 1) {
        setBackPressCount(0)
        BackHandler.exitApp()
        return true
      } else {
        setBackPressCount(1)
        Toast.show({
          text1: 'Press back again to exit',
          position: 'bottom',
          visibilityTime: 2000,
        })

        backPressTimeout = setTimeout(() => {
          setBackPressCount(0)
        }, 2000)

        return true
      }
    })

    router.setParams({ backBehavior: 'none' })

    return () => {
      backHandler.remove()
      if (backPressTimeout) clearTimeout(backPressTimeout)
    }
  }, [router, backPressCount])
};
