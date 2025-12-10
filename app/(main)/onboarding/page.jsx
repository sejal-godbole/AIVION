import { redirect } from 'next/navigation'
import { getUserOnboardingStatus } from "@/actions/user"
import { industries } from "@/components/data/industries"
import OnboardingForm from "./_components/onboarding_form" 

const OnboardingPage = async () => {
  const {isOnboarded} = await getUserOnboardingStatus();

  if (isOnboarded) {
    redirect("/dashboard")
  }

  return <main>
    <OnboardingForm industries={industries}/>
  </main>
}

export default OnboardingPage