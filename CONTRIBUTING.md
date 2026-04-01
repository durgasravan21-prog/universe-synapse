# Contributing to UniVerse Synapse

Thank you for considering contributing to UniVerse Synapse! We welcome contributions from the community. Please read this guide to understand how to contribute effectively.

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Getting Started

### Prerequisites

- Node.js 22.13.0 or higher
- pnpm 10.4.1 or higher
- Git
- GitHub account

### Setup Development Environment

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/universe-synapse.git
cd universe-synapse

# Add upstream remote
git remote add upstream https://github.com/durgasravan21-prog/universe-synapse.git

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Making Changes

### Branch Naming Convention

Create branches with descriptive names following this pattern:

```
feature/description-of-feature
bugfix/description-of-bug
docs/description-of-documentation
refactor/description-of-refactoring
security/description-of-security-fix
```

Examples:
- `feature/add-course-management`
- `bugfix/fix-otp-validation`
- `security/implement-rate-limiting`
- `docs/update-api-documentation`

### Commit Message Convention

Follow the Conventional Commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring without feature changes
- `perf`: Performance improvements
- `test`: Test additions or changes
- `chore`: Build process, dependencies, etc.
- `security`: Security-related changes

Examples:
```
feat(auth): add two-factor authentication
fix(otp): resolve OTP expiration validation bug
docs(readme): update installation instructions
security(rate-limit): implement API rate limiting
```

### Code Style

We follow these style guidelines:

#### TypeScript/JavaScript
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for code formatting
- 2-space indentation
- Semicolons required
- Single quotes for strings

#### React
- Functional components with hooks
- Use TypeScript for props
- Meaningful component names
- Extract reusable components
- Keep components focused and small

#### CSS/Tailwind
- Use Tailwind utility classes
- Follow mobile-first approach
- Use CSS variables for theming
- Avoid inline styles
- Maintain consistent spacing

### Code Quality

```bash
# Format code
pnpm format

# Check TypeScript
pnpm check

# Run linter
pnpm lint

# Run tests
pnpm test
```

## Security Considerations

When contributing, please ensure:

1. **No Secrets**: Never commit API keys, passwords, or sensitive data
2. **Input Validation**: Always validate and sanitize user inputs
3. **XSS Prevention**: Sanitize HTML and prevent injection attacks
4. **CSRF Protection**: Use CSRF tokens for state-changing operations
5. **Rate Limiting**: Implement rate limiting for sensitive operations
6. **Audit Logging**: Log security-relevant events
7. **Encryption**: Use encryption for sensitive data
8. **Dependencies**: Keep dependencies updated and scan for vulnerabilities

## Testing

### Writing Tests

```typescript
// Example test
describe('InputValidator', () => {
  it('should validate email format correctly', () => {
    expect(InputValidator.isValidEmail('test@example.com')).toBe(true);
    expect(InputValidator.isValidEmail('invalid-email')).toBe(false);
  });
});
```

### Test Coverage

- Aim for >80% code coverage
- Test happy paths and error cases
- Test security-sensitive functions thoroughly

```bash
# Run tests with coverage
pnpm test:coverage
```

## Documentation

### Code Documentation

- Add JSDoc comments to functions
- Document complex logic
- Include examples for public APIs
- Update README if adding features

Example:
```typescript
/**
 * Validate email format
 * @param email - Email address to validate
 * @returns true if email is valid, false otherwise
 * @example
 * InputValidator.isValidEmail('test@example.com') // true
 */
static isValidEmail(email: string): boolean {
  // Implementation
}
```

### Documentation Files

- Update README.md for user-facing changes
- Update SECURITY.md for security-related changes
- Add/update API documentation for backend changes
- Include examples and use cases

## Pull Request Process

### Before Submitting

1. **Update your branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Test your changes**
   ```bash
   pnpm test
   pnpm build
   ```

3. **Check code quality**
   ```bash
   pnpm format
   pnpm lint
   pnpm check
   ```

4. **Update documentation**
   - Update README.md if needed
   - Add/update code comments
   - Update CHANGELOG.md

### Submitting a Pull Request

1. Push your branch to your fork
   ```bash
   git push origin your-branch-name
   ```

2. Create a Pull Request on GitHub with:
   - Clear title describing the change
   - Detailed description of what changed and why
   - Reference to related issues (#123)
   - Screenshots for UI changes
   - Testing instructions

3. PR Template:
   ```markdown
   ## Description
   Brief description of the changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Related Issues
   Closes #123

   ## Testing
   Describe how to test the changes

   ## Screenshots (if applicable)
   Add screenshots for UI changes

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Tests added/updated
   - [ ] Documentation updated
   - [ ] No new warnings generated
   - [ ] Tested locally
   ```

### Review Process

- At least 2 approvals required
- All CI checks must pass
- Code review feedback must be addressed
- Maintainers may request changes

## Reporting Issues

### Bug Reports

Include:
- Clear title and description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/logs if applicable
- Environment (OS, browser, Node version)

### Feature Requests

Include:
- Clear title and description
- Use case and motivation
- Proposed solution
- Alternative approaches
- Additional context

### Security Issues

**Do not open public issues for security vulnerabilities!**

Report to: security@synapse.in

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Development Workflow

### Feature Development

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat(scope): add my feature"

# Push to fork
git push origin feature/my-feature

# Create Pull Request on GitHub
```

### Bug Fixes

```bash
# Create bugfix branch
git checkout -b bugfix/my-bug

# Make changes and commit
git add .
git commit -m "fix(scope): fix my bug"

# Push to fork
git push origin bugfix/my-bug

# Create Pull Request on GitHub
```

## Project Structure

```
universe-synapse/
├── client/              # Frontend React application
├── server/              # Backend (placeholder)
├── shared/              # Shared types and constants
├── docs/                # Documentation
├── SECURITY.md          # Security documentation
├── README.md            # Project README
├── CONTRIBUTING.md      # This file
└── package.json         # Project dependencies
```

## Performance Considerations

- Minimize bundle size
- Optimize images and assets
- Use code splitting for large components
- Implement lazy loading
- Avoid unnecessary re-renders
- Profile with React DevTools

## Accessibility

- Follow WCAG 2.1 guidelines
- Add alt text to images
- Use semantic HTML
- Ensure keyboard navigation
- Test with screen readers
- Maintain color contrast ratios

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Questions?

- Check [FAQ](./docs/FAQ.md)
- Read [Documentation](./docs/)
- Open a GitHub Discussion
- Email: support@synapse.in

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for contributing to UniVerse Synapse! 🎉
