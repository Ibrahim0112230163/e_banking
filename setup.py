#!/usr/bin/env python3
"""
E-Banking System - Complete Setup Script
Automates the entire setup process for development and testing
"""

import os
import sys
import subprocess
import platform

def print_header(title):
    """Print a formatted header"""
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70 + "\n")

def print_step(step_num, title):
    """Print a step title"""
    print(f"\n📍 Step {step_num}: {title}")
    print("-" * 70)

def print_success(message):
    """Print success message"""
    print(f"✅ {message}")

def print_error(message):
    """Print error message"""
    print(f"❌ {message}")

def print_info(message):
    """Print info message"""
    print(f"ℹ️  {message}")

def run_command(cmd, description=""):
    """Run a shell command and return success status"""
    if description:
        print(f"Running: {description}")
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            return True, result.stdout
        else:
            return False, result.stderr
    except Exception as e:
        return False, str(e)

def setup_backend():
    """Setup Python backend"""
    print_step(1, "Backend Setup")
    
    # Check Python installation
    print_info("Checking Python installation...")
    success, output = run_command("python --version", "Getting Python version")
    if success:
        print_success(f"Python found: {output.strip()}")
    else:
        print_error("Python not found. Please install Python 3.9+")
        return False
    
    # Install Python dependencies
    print_info("\nInstalling Python dependencies...")
    dependencies = [
<<<<<<< HEAD
        ("flask", "Flask web framework"),
        ("flask-cors", "CORS support for Flask"),
        ("pycryptodome", "Cryptographic library"),
        ("supabase", "Supabase Python client"),
        ("python-dotenv", "Environment variable management"),
=======
        ("fastapi", "FastAPI web framework"),
        ("uvicorn", "ASGI server for FastAPI"),
        ("pycryptodome", "Cryptographic library"),
        ("supabase", "Supabase Python client"),
        ("python-dotenv", "Environment variable management"),
        ("psycopg2-binary", "PostgreSQL database adapter"),
>>>>>>> origin/updated
    ]
    
    for package, description in dependencies:
        print_info(f"Installing {package} ({description})...")
        success, output = run_command(f"pip install {package}", f"Installing {package}")
        if success:
            print_success(f"{package} installed")
        else:
            print_error(f"Failed to install {package}: {output}")
            return False
    
    return True

def setup_frontend():
    """Setup React frontend"""
    print_step(2, "Frontend Setup")
    
    # Check Node.js installation
    print_info("Checking Node.js installation...")
    success, output = run_command("node --version", "Getting Node version")
    if success:
        print_success(f"Node.js found: {output.strip()}")
    else:
        print_error("Node.js not found. Please install Node.js 18+")
        return False
    
    # Check npm installation
    print_info("Checking npm installation...")
    success, output = run_command("npm --version", "Getting npm version")
    if success:
        print_success(f"npm found: {output.strip()}")
    else:
        print_error("npm not found")
        return False
    
    # Install npm dependencies
    print_info("\nInstalling npm packages (this may take a few minutes)...")
    success, output = run_command("npm install", "Installing npm dependencies")
    if success:
        print_success("npm dependencies installed")
    else:
        print_error(f"Failed to install npm dependencies: {output}")
        return False
    
    return True

def verify_build():
    """Verify that the project builds successfully"""
    print_step(3, "Build Verification")
    
    print_info("Building frontend project...")
    success, output = run_command("npm run build", "Building frontend")
    if success:
        print_success("Frontend builds successfully")
        return True
    else:
        print_error(f"Build failed: {output}")
        return False

def create_env_files():
    """Create necessary environment files"""
    print_step(4, "Environment Configuration")
    
    # Frontend .env file
    print_info("Creating frontend .env file...")
    frontend_env = """VITE_BACKEND_URL=http://localhost:5000
"""
    
    try:
        with open(".env", "w") as f:
            f.write(frontend_env)
        print_success("Created .env file for frontend")
    except Exception as e:
        print_error(f"Failed to create .env file: {e}")
        return False
    
    # Backend .env file (optional)
    print_info("Creating backend .env file...")
    backend_env = """SUPABASE_URL=https://khzndbglgukpdtiwqspc.supabase.co
SUPABASE_KEY=sb_publishable_NU2tIO21EoQQwrOu9MvxVw_skcg9Lq0
FLASK_ENV=development
FLASK_DEBUG=1
"""
    
    try:
        with open(".env.backend", "w") as f:
            f.write(backend_env)
        print_success("Created .env.backend file")
    except Exception as e:
        print_error(f"Failed to create .env.backend file: {e}")
    
    return True

def show_startup_instructions():
    """Show instructions for starting the application"""
    print_step(5, "Startup Instructions")
    
    print_info("The e-banking system is now ready to run!")
    print("\n📱 To start the application, open TWO terminal windows:\n")
    
    print("Terminal 1 - Start Backend:")
    print("  $ python app.py")
    print("  Expected output: Running on http://localhost:5000")
    
    print("\nTerminal 2 - Start Frontend:")
    print("  $ npm run dev")
    print("  Expected output: Local URL: http://localhost:5173")
    
    print("\n🔐 Demo Users (for testing):")
    print("  Username: sohan | K2: Sohan_Password_K2_1234567890AB")
    print("  Username: bob   | K2: Bob_Password_K2_9876543210CD")
    print("  Username: alice | K2: Alice_Password_K2_ABCDEF123456")
    
    print("\n📚 Documentation:")
    print("  • FINAL_INTEGRATION_GUIDE.md - Complete architecture & features")
    print("  • README.md - Project overview")
    print("  • THESIS_DOCUMENTATION.md - Detailed technical documentation")

def main():
    """Main setup function"""
    print_header("🏦 E-Banking System - Setup Wizard")
    
    print("Welcome to the e-banking system setup!")
    print("This script will configure your development environment.")
    print(f"Platform: {platform.system()}")
    
    # Step 1: Backend setup
    if not setup_backend():
        print_error("\nBackend setup failed. Please fix the errors and try again.")
        sys.exit(1)
    print_success("\n✅ Backend setup complete!")
    
    # Step 2: Frontend setup
    if not setup_frontend():
        print_error("\nFrontend setup failed. Please fix the errors and try again.")
        sys.exit(1)
    print_success("\n✅ Frontend setup complete!")
    
    # Step 3: Verify build
    if not verify_build():
        print_error("\nBuild verification failed. Please fix the errors and try again.")
        sys.exit(1)
    
    # Step 4: Create environment files
    if not create_env_files():
        print_error("\nEnvironment setup failed. Please fix the errors and try again.")
        sys.exit(1)
    
    # Step 5: Show startup instructions
    show_startup_instructions()
    
    print_header("✅ Setup Complete!")
    print("\nNext steps:")
    print("1. Open two terminal windows")
    print("2. Run 'python app.py' in the first terminal")
    print("3. Run 'npm run dev' in the second terminal")
    print("4. Open http://localhost:5173 in your browser")
    print("\nHappy banking! 🎉\n")

if __name__ == "__main__":
    main()
