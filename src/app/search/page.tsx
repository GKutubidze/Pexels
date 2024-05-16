'use client'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Search() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the homepage
        router.push('/');
    }, []); // Empty dependency array ensures the effect runs only once when the component mounts

    // Return null to prevent rendering anything on the search page
    return null;
}
