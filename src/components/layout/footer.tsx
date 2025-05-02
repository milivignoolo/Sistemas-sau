export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-6 mt-12">
      <div className="container mx-auto px-4 text-center text-sm">
        © {new Date().getFullYear()} Secretaría de Asuntos Universitarios (SAU) - UTN. Todos los derechos reservados.
      </div>
    </footer>
  );
}
