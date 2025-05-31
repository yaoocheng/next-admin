import MenuC from "./ui/menu";
import Header from "./ui/header";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="flex h-full items-center">
                <MenuC />
                <div className="flex-1 w-0 h-full">
                    <Header />
                    <div className="h-[calc(100%-56px)] w-full">{children}</div>
                </div>
            </div>
        </>
    );
}
