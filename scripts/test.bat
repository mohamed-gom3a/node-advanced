@echo off
REM Test runner script for the blog application (Windows)
REM Usage: scripts\test.bat [unit|e2e|all|coverage|watch]

setlocal enabledelayedexpansion

REM Set colors for output (Windows 10+ supports ANSI colors)
set "BLUE=[94m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "RED=[91m"
set "NC=[0m"

REM Function to print colored output
:print_status
echo %BLUE%[INFO]%NC% %~1
goto :eof

:print_success
echo %GREEN%[SUCCESS]%NC% %~1
goto :eof

REM Function to check if dependencies are installed
:check_dependencies
call :print_status "Checking dependencies..."

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo %RED%[ERROR]%NC% Node.js is not installed
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo %RED%[ERROR]%NC% npm is not installed
    exit /b 1
)

call :print_success "Dependencies check passed"
goto :eof

REM Function to install dependencies if needed
:install_dependencies
call :print_status "Installing backend dependencies..."
call npm install

call :print_status "Installing frontend dependencies..."
cd client
call npm install
cd ..

call :print_success "Dependencies installed"
goto :eof

REM Function to run backend unit tests
:run_unit_tests
call :print_status "Running backend unit tests..."
call npm run test:unit
call :print_success "Backend unit tests completed"
goto :eof

REM Function to run E2E tests
:run_e2e_tests
call :print_status "Running E2E tests..."
call npm run test:e2e
call :print_success "E2E tests completed"
goto :eof

REM Function to run all tests
:run_all_tests
call :print_status "Running all tests..."
call npm test
call :print_success "All tests completed"
goto :eof

REM Function to run tests with coverage
:run_coverage_tests
call :print_status "Running tests with coverage..."
call npm run test:coverage
call :print_success "Coverage tests completed"
goto :eof

REM Function to run tests in watch mode
:run_watch_tests
call :print_status "Running tests in watch mode..."
call npm run test:watch
goto :eof

REM Function to run frontend tests
:run_frontend_tests
call :print_status "Running frontend tests..."
cd client
call npm test
cd ..
call :print_success "Frontend tests completed"
goto :eof

REM Main script logic
:main
set "test_type=%~1"
if "%test_type%"=="" set "test_type=all"

call :print_status "Starting test runner..."

REM Check dependencies
call :check_dependencies
if %errorlevel% neq 0 exit /b 1

REM Install dependencies if package-lock.json doesn't exist
if not exist "package-lock.json" (
    call :print_status "package-lock.json not found, installing dependencies..."
    call :install_dependencies
)

REM Run appropriate test based on argument
if "%test_type%"=="unit" (
    call :run_unit_tests
) else if "%test_type%"=="e2e" (
    call :run_e2e_tests
) else if "%test_type%"=="frontend" (
    call :run_frontend_tests
) else if "%test_type%"=="coverage" (
    call :run_coverage_tests
) else if "%test_type%"=="watch" (
    call :run_watch_tests
) else if "%test_type%"=="all" (
    call :run_all_tests
) else (
    echo %RED%[ERROR]%NC% Unknown test type: %test_type%
    echo Usage: %0 [unit^|e2e^|frontend^|all^|coverage^|watch]
    exit /b 1
)

call :print_success "Test runner completed successfully!"
goto :eof

REM Run main function with all arguments
call :main %*
