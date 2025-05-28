// ABOUTME: This file contains utility functions for color manipulation and calculations
// ABOUTME: Includes hex color generation, RGB conversion, and color distance calculations

/**
 * Generates a random hex color string
 * @returns {string} A hex color string in format #RRGGBB
 */
function generateRandomHexColor() {
    const chars = '0123456789ABCDEF';
    let result = '#';
    for (let i = 0; i < 6; i++) {
        result += chars[Math.floor(Math.random() * 16)];
    }
    return result;
}

/**
 * Converts a hex color string to RGB object
 * @param {string} hexString - Hex color string (with or without #)
 * @returns {object} RGB object with r, g, b properties (0-255)
 */
function hexToRgb(hexString) {
    // Input validation
    if (typeof hexString !== 'string') {
        throw new Error('Hex string must be a string');
    }
    
    // Remove # if present
    const hex = hexString.startsWith('#') ? hexString.slice(1) : hexString;
    
    // Validate length
    if (hex.length !== 6) {
        throw new Error('Hex string must be exactly 6 characters (excluding #)');
    }
    
    // Validate hex characters
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
        throw new Error('Hex string contains invalid characters');
    }
    
    // Convert to uppercase for consistency
    const upperHex = hex.toUpperCase();
    
    // Extract RGB components
    const r = parseInt(upperHex.slice(0, 2), 16);
    const g = parseInt(upperHex.slice(2, 4), 16);
    const b = parseInt(upperHex.slice(4, 6), 16);
    
    return { r, g, b };
}

/**
 * Calculates the distance between two RGB colors using Manhattan distance
 * @param {object} rgb1 - First RGB color {r, g, b}
 * @param {object} rgb2 - Second RGB color {r, g, b}
 * @returns {number} Distance between the colors
 */
function calculateColorDistance(rgb1, rgb2) {
    // Input validation
    if (!rgb1 || !rgb2 || typeof rgb1 !== 'object' || typeof rgb2 !== 'object') {
        throw new Error('Both parameters must be RGB objects');
    }
    
    // Check for required properties
    if (!('r' in rgb1) || !('g' in rgb1) || !('b' in rgb1)) {
        throw new Error('First RGB object must have r, g, b properties');
    }
    
    if (!('r' in rgb2) || !('g' in rgb2) || !('b' in rgb2)) {
        throw new Error('Second RGB object must have r, g, b properties');
    }
    
    // Validate RGB value ranges
    const validateRgbValue = (value, component, objectNumber) => {
        if (typeof value !== 'number' || value < 0 || value > 255) {
            throw new Error(`RGB ${component} value in object ${objectNumber} must be a number between 0-255`);
        }
    };
    
    validateRgbValue(rgb1.r, 'r', 1);
    validateRgbValue(rgb1.g, 'g', 1);
    validateRgbValue(rgb1.b, 'b', 1);
    validateRgbValue(rgb2.r, 'r', 2);
    validateRgbValue(rgb2.g, 'g', 2);
    validateRgbValue(rgb2.b, 'b', 2);
    
    // Calculate Manhattan distance: |R1-R2| + |G1-G2| + |B1-B2|
    const distance = Math.abs(rgb1.r - rgb2.r) + Math.abs(rgb1.g - rgb2.g) + Math.abs(rgb1.b - rgb2.b);
    
    return distance;
}