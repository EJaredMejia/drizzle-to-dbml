# Drizzle Schema to DBML Converter

A web-based tool that converts Drizzle ORM schemas to DBML format, complete with syntax highlighting and one-click visualization.

## ✨ Features

- 🚀 Instant conversion from Drizzle schema to DBML
- 🎨 Built with React 19 and TypeScript
- 📝 Monaco Editor integration for a great editing experience
- 📊 One-click visualization with DBDiagram.io
- 📋 Copy to clipboard functionality
- 🌓 Dark mode ready
- ⚡️ Runs entirely in the browser (no server-side processing)

## 🚀 Getting Started

### Prerequisites

- Bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/EJaredMejia/drizzle-to-dbml.git
   cd drizzle-to-dbml
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Start the development server:
   ```bash
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Development

### Available Scripts

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun preview` - Preview production build
- `bun test` - Run tests
- `bun lint` - Run linter
- `bun format` - Format code

## 🗂️ Project Structure

- `src/components` - Reusable React components
- `src/routes` - Application routes
- `src/lib` - Utility functions and shared logic
- `src/hooks` - Custom React hooks
- `public` - Static assets

## 📚 How to Use

1. Paste your Drizzle schema in the left editor
2. The DBML output will be automatically generated in the right panel
3. Use the copy button to copy the DBML to your clipboard
4. Click "Open in DBDiagram" to visualize your schema

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

# Building For Production

To build this application for production:

```bash
bun build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
bun test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.
