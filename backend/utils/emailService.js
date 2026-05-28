const nodemailer = require('nodemailer');

const hasValue = (value) => typeof value === 'string' && value.trim().length > 0;

const log = (logger, level, ...args) => {
  if (logger && typeof logger[level] === 'function') {
    logger[level](...args);
  } else if (console && typeof console[level] === 'function') {
    console[level](...args);
  }
};

const getPrimarySmtpConfig = () => {
  const user = process.env.BREVO_SMTP_LOGIN;
  const pass = process.env.BREVO_SMTP_PASSWORD;
  if (!hasValue(user) || !hasValue(pass)) return null;
  return {
    name: 'brevo-smtp',
    config: {
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: user.trim(),
        pass: pass.trim(),
      },
    },
  };
};

const getBrevoSmtpConfig = () => null;

const createTransporter = async (logger) => {
  const primary = getPrimarySmtpConfig();
  const brevo = getBrevoSmtpConfig();
  let transporter = null;
  let provider = null;
  let smtpVerified = false;
  let lastError = null;

  const verifyTransporter = async (candidate, name) => {
    const testTransporter = nodemailer.createTransport(candidate.config);
    try {
      await testTransporter.verify();
      return { transporter: testTransporter, provider: name, smtpVerified: true };
    } catch (err) {
      return { transporter: null, provider: name, smtpVerified: false, lastError: err };
    }
  };

  if (primary) {
    log(logger, 'info', `Email helper: attempting primary SMTP provider ${primary.name}`);
    const result = await verifyTransporter(primary, primary.name);
    if (result.smtpVerified) {
      return result;
    }
    log(logger, 'warn', `Primary SMTP verify failed for ${primary.name}:`, result.lastError);
    lastError = result.lastError;
  }

  if (brevo) {
    log(logger, 'info', 'Email helper: attempting Brevo SMTP provider');
    const result = await verifyTransporter(brevo, brevo.name);
    if (result.smtpVerified) {
      return result;
    }
    log(logger, 'warn', 'Brevo SMTP verify failed:', result.lastError);
    lastError = result.lastError;
  }

  if (process.env.NODE_ENV !== 'production') {
    log(logger, 'warn', 'Email helper: falling back to Ethereal dev SMTP because no valid SMTP provider verified');
    const testAccount = await nodemailer.createTestAccount();
    const etherealTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    await etherealTransporter.verify();
    return {
      transporter: etherealTransporter,
      provider: 'ethereal',
      smtpVerified: false,
      lastError,
      ethereal: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    };
  }

  throw new Error(`No SMTP transmitter could be initialized${lastError ? `: ${lastError.message}` : ''}`);
};

const getPreviewUrl = (info) => {
  try {
    return nodemailer.getTestMessageUrl(info);
  } catch (err) {
    return null;
  }
};

const logEnvVars = (logger) => {
  log(logger, 'info', 'BREVO_SMTP_LOGIN exists:', hasValue(process.env.BREVO_SMTP_LOGIN));
  log(logger, 'info', 'BREVO_SMTP_PASSWORD exists:', hasValue(process.env.BREVO_SMTP_PASSWORD));
  log(logger, 'info', 'EMAIL_FROM exists:', hasValue(process.env.EMAIL_FROM));
};

module.exports = {
  createTransporter,
  getPreviewUrl,
  logEnvVars,
};
