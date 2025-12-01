import { LoginForm } from '@/components/auth/login-form';
import { BackgroundAnimation } from '@/components/ui/background-animation';

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black p-4 relative overflow-hidden">
            <BackgroundAnimation backgroundImage="/background3.png" />
            <div className="relative z-10 w-full max-w-md">
                <LoginForm />
            </div>
        </div>
    );
}
