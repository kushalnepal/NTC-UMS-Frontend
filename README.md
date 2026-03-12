# NTC User Management System - Frontend

A modern React-based frontend application built with Next.js for the NTC User Management System. This application provides a comprehensive interface for managing users, organizations, and hierarchical structures.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-61DAFB)
![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Features

- **User Authentication**
  - Secure login and signup functionality
  - JWT token-based authentication
  - Persistent session management

- **Dashboard**
  - Overview of system statistics
  - Quick access to main features
  - Real-time data visualization

- **Member Management**
  - View and manage system users
  - Role-based access control
  - User profile management

- **Organization Hierarchy**
  - Visual representation of organizational structure
  - Hierarchical user relationships
  - Easy navigation between levels

- **Token Management**
  - API token generation and management
  - Secure token storage
  - Token expiration handling

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** JavaScript/React
- **State Management:** React Context API
- **HTTP Client:** Fetch API with custom wrapper
- **Styling:** CSS Modules / Inline Styles

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn

## 🔧 Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure environment variables:

   ```bash
   # Create .env.local file
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
frontend/
├── public/                  # Static files
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── dashboard/      # Protected dashboard routes
│   │   │   ├── hierarchy/  # Organization hierarchy
│   │   │   ├── members/    # Member management
│   │   │   └── tokens/     # Token management
│   │   ├── login/          # Login page
│   │   └── signup/         # Signup page
│   ├── components/        # Reusable React components
│   ├── context/           # React Context providers
│   ├── utils/             # Utility functions
│   │   └── api.js         # API client
│   ├── styles.js          # Global styles
│   └── App.js             # Main app component
├── package.json
├── next.config.js
└── jsconfig.json
```

## 🔐 API Integration

The frontend communicates with the Django REST API. All API calls are handled through the custom API utility in [`src/utils/api.js`](frontend/src/utils/api.js).

### Available Endpoints

- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `GET /api/auth/users/` - List all users
- `GET /api/auth/users/{id}/` - Get user details
- `PUT /api/auth/users/{id}/` - Update user
- `DELETE /api/auth/users/{id}/` - Delete user
- `GET /api/organization/hierarchy/` - Get organization hierarchy
- `POST /api/auth/token/` - Generate API token

## 🎨 Customization

### Styling

The application uses a centralized styling approach in [`src/styles.js`](frontend/src/styles.js). You can modify:

- Color scheme
- Typography
- Spacing
- Component styles

### Theme Colors

```javascript
const colors = {
  primary: "#0066cc", // Main brand color
  secondary: "#6c757d", // Secondary color
  success: "#28a745", // Success states
  danger: "#dc3545", // Error/danger states
  warning: "#ffc107", // Warning states
  background: "#f8f9fa", // Page background
  text: "#212529", // Primary text
};
```

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables
4. Deploy!
5. url([Subdomain](https://ntc-ums-frontend.kushalnepal.com.np)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Your Name - [GitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Django REST Framework](https://www.django-rest-framework.org)

---

<p align="center">Made with ❤️ for NTC User Management System</p>
