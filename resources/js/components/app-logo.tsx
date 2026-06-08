export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-10 items-center justify-center rounded-md">
                <img src="/images/logo.png" alt="HealthWise" className="size-10 rounded-md object-contain" />
            </div>
            <div className="ml-2 grid flex-1 text-left">
                <span className="truncate text-base leading-tight font-bold">
                    HealthWise
                </span>
            </div>
        </>
    );
}
