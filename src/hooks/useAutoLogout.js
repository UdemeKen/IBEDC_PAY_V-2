import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

/**
 * Custom hook to automatically log out users after a period of inactivity
 * @param {number} timeoutMinutes - Minutes of inactivity before logout (default: 10)
 * @param {function} onLogout - Callback function to execute on logout
 * @param {function} setShowWarningModal - Function to show/hide warning modal
 */
export const useAutoLogout = (timeoutMinutes = 10, onLogout, setShowWarningModal) => {
  const timeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const timeoutMs = timeoutMinutes * 60 * 1000; // Convert minutes to milliseconds
  const warningTimeMs = (timeoutMinutes - 1) * 60 * 1000; // Show warning 1 minute before logout

  const resetTimer = () => {
    // Check if user is still logged in
    const token = localStorage.getItem('TOKEN');
    if (!token) {
      return; // User already logged out, don't set timer
    }

    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Hide warning modal if it's showing
    if (setShowWarningModal) {
      setShowWarningModal(false);
    }

    // Set warning timer (1 minute before logout)
    warningTimeoutRef.current = setTimeout(() => {
      const currentToken = localStorage.getItem('TOKEN');
      if (!currentToken) {
        return; // User already logged out
      }
      
      // Show warning modal
      if (setShowWarningModal) {
        setShowWarningModal(true);
      }
    }, warningTimeMs);

    // Set logout timer
    timeoutRef.current = setTimeout(() => {
      // Double-check token still exists before logging out
      const currentToken = localStorage.getItem('TOKEN');
      if (!currentToken) {
        return; // User already logged out
      }

      // Hide warning modal
      if (setShowWarningModal) {
        setShowWarningModal(false);
      }

      // Execute logout
      if (onLogout) {
        onLogout();
      } else {
        // Default logout behavior
        localStorage.clear();
        toast.warning('Your session has expired due to inactivity. Please login again.');
        navigate('/');
      }
    }, timeoutMs);
  };

  useEffect(() => {
    // Check if user is logged in before setting up auto-logout
    const token = localStorage.getItem('TOKEN');
    if (!token) {
      return; // User not logged in, don't set up auto-logout
    }

    // List of events that indicate user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, resetTimer, true);
    });

    // Initialize timer
    resetTimer();

    // Cleanup function
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer, true);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [timeoutMs, warningTimeMs, onLogout, navigate, setShowWarningModal]);

  return { resetTimer };
};

