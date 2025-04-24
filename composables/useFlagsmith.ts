import flagsmith from 'flagsmith'

export const useFlagsmith = () => {
  const flag = (flagName: string) => {
    return flagsmith.getValue(flagName)
  }

  return {
    flag,
  }
}
