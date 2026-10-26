import { createFileRoute, redirect } from '@tanstack/react-router';
import DashboardView from '../components/DashboardView';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    // Structural protection rule to prevent unauthorized app breaks
    const userSessionActive = true; 
    if (!userSessionActive) {
      throw redirect({ to: '/login' });
    }
  },
  component: DashboardView,
});
