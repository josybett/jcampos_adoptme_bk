export const errorHandler = (error, req, res, next) => {
  console.error('Error:', error.cause);
  
  switch(error.code) {
      case 1: // INVALID_TYPES_ERROR
          return res.status(400).json({ status: 'error', error: error.message });
      case 5: // VALIDATION_ERROR
          return res.status(400).json({ status: 'error', error: error.message });
      
      case 2: // DATABASE_ERROR
          return res.status(500).json({ status: 'error', error: error.message });
      
      case 3: // AUTHENTICATION_ERROR
          return res.status(401).json({ status: 'error', error: error.message });
      
      case 4: // AUTHORIZATION_ERROR
          return res.status(403).json({ status: 'error', error: error.message });
      
      case 6: // NOT_FOUND_ERROR
          return res.status(404).json({ status: 'error', error: error.message });
      
      case 7: // DUPLICATE_ERROR
          return res.status(409).json({ status: 'error', error: error.message });
      
      default:
          return res.status(500).json({ status: 'error', error: 'Unhandled error' });
  }
};