export function Header() {
  return (
    <header className="bg-primary text-primary-foreground py-6 shadow-lg">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">IBOM Tech Week 2025</h1>
            <p className="text-primary-foreground/80 mt-1">Get your tickets now</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Nov 3-8, 2025</p>
            <p className="text-sm opacity-90">Ceedapeg Hotels, Uyo</p>
          </div>
        </div>
      </div>
    </header>
  )
}
