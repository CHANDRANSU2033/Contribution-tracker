export async function register() {
    if(process.env.NEXT_RUNTIME === 'nodejs') {
        const {initializeServices} = await import('@/lib/server-init')
    }
}