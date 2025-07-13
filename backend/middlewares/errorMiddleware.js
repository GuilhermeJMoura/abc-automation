const config = require('../config/env');

class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

const handleAxiosError = (err) => {
  if (err.response) {
    // Erro de resposta do servidor
    const message = err.response.data?.error || err.response.data?.message || 'Erro no servidor externo';
    return new AppError(message, err.response.status || 500);
  } else if (err.request) {
    // Erro de rede
    return new AppError('Erro de conexão com serviço externo. Tente novamente.', 503);
  } else {
    // Erro na configuração da requisição
    return new AppError('Erro interno na comunicação com serviços externos', 500);
  }
};

const sendErrorDev = (err, req, res) => {
  return res.status(err.statusCode).json({
    error: err.message,
    status: err.status,
    stack: config.nodeEnv === 'development' ? err.stack : undefined,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  });
};

const sendErrorProd = (err, req, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
  
  // Programming or other unknown error: don't leak error details
  console.error('ERROR 💥:', err);
  return res.status(500).json({
    error: 'Algo deu errado!',
    timestamp: new Date().toISOString()
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error for monitoring
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  if (config.nodeEnv === 'development') {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (error.isAxiosError) error = handleAxiosError(error);

    sendErrorProd(error, req, res);
  }
};

module.exports.AppError = AppError;
