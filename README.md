# Web Tools Suite

A comprehensive collection of web-based tools built with Vue 3 + TypeScript + Tailwind CSS. Includes resume builder, document viewer, format converters, and various developer utilities.

## ✨ Features

- 📄 **Resume Builder** - Professional resume builder with real-time preview and multiple templates
- 📑 **Office Viewer** - View Word, Excel, and PDF documents online
- 🔧 **20+ Utility Tools** - Various tools for developers and everyday use

## 🛠️ Available Tools

### Document & Office
- **Resume Builder** - Create and export professional resumes
- **Office Viewer** - View DOCX, XLSX, PDF files in browser
- **Format Converter** - Convert between different file formats
- **Watermark Remover** - Remove watermarks from documents

### Developer Tools
- **JSON Formatter** - Format and validate JSON
- **Base64 Converter** - Encode/decode Base64
- **URL Encoder** - Encode and decode URLs
- **Text Cipher** - Encrypt and decrypt text
- **Hash Generator** - Generate MD5, SHA1, SHA256 hashes
- **Text Diff** - Compare two text files
- **Web Scraper** - Extract data from web pages

### Productivity Tools
- **Word Counter** - Count words and characters
- **QR Generator** - Generate QR codes
- **Password Manager** - Secure password storage
- **Password Generator** - Generate strong passwords
- **Link Checker** - Check broken links on websites
- **IP Checker** - Check your IP address
- **Timestamp Converter** - Convert Unix timestamps
- **Color Picker** - Pick and convert colors
- **Random Number** - Generate random numbers
- **Full Screen Clock** - Fullscreen digital clock

## 🚀 Quick Start

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

Visit http://localhost:5173 to access all tools.

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## 📁 Project Structure

```
resume-builder/
├── src/
│   ├── views/
│   │   ├── tools/           # All utility tools
│   │   │   ├── WebScraper.vue
│   │   │   ├── LinkChecker.vue
│   │   │   ├── ColorPicker.vue
│   │   │   ├── JsonFormatter.vue
│   │   │   ├── Base64Converter.vue
│   │   │   ├── QrGenerator.vue
│   │   │   ├── PasswordManager.vue
│   │   │   ├── WatermarkRemover.vue
│   │   │   ├── FormatConverter.vue
│   │   │   ├── WordCounter.vue
│   │   │   ├── TextCipher.vue
│   │   │   ├── UrlEncoder.vue
│   │   │   ├── PasswordGenerator.vue
│   │   │   ├── TimestampConverter.vue
│   │   │   ├── IPChecker.vue
│   │   │   ├── HashGenerator.vue
│   │   │   ├── TextDiff.vue
│   │   │   ├── RandomNumber.vue
│   │   │   └── FullScreenClock.vue
│   │   ├── HomePage.vue
│   │   └── OfficeViewer.vue
│   ├── components/          # Shared components
│   ├── stores/              # Pinia stores
│   ├── router/              # Vue Router config
│   ├── App.vue
│   └── main.ts
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## 🛠️ Tech Stack

- **Vue 3** - UI framework with Composition API
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool
- **Vue Router** - Client-side routing
- **Pinia** - State management
- **Lucide Vue** - Icon library
- **html2canvas** - Screenshot functionality
- **jsPDF** - PDF generation
- **crypto-js** - Cryptography functions
- **jszip** - ZIP file handling
- **file-saver** - File saving
- **marked** - Markdown parsing
- **@vue-office** - Office document viewer

## 📄 License

Apache 2.0

## 📝 Copyright

Copyright © 2024 [Your Name]. All rights reserved.

## 🙏 Contributing

Issues and Pull Requests are welcome!

---

**Made with ❤️ using Vue 3 + TypeScript + Tailwind CSS**
