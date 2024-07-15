import React, { Component } from 'react'

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className='flex flex-col justify-center items-center h-screen'>
                    <h1 className='text-xl font-bold text-red-500'>Something went wrong</h1>
                    <p>For further enquiries, please contact: 07059093900</p>
                    <h1>Thank you!</h1>
                </div>
            )
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
