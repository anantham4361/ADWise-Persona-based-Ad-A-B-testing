import { body, validationResult } from 'express-validator';

export const validatePersonaRequest = [
  body('prompt')
    .notEmpty()
    .withMessage('Prompt is required')
    .isLength({ min: 10 })
    .withMessage('Prompt must be at least 10 characters long'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        detail: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

export const validateAdUpload = (req, res, next) => {
  // Check if persona_prompt is provided
  if (!req.body.persona_prompt || req.body.persona_prompt.trim().length < 10) {
    return res.status(400).json({
      detail: 'Persona prompt is required and must be at least 10 characters long'
    });
  }

  // Check if both files are uploaded
  if (!req.files || !req.files['ad_a'] || !req.files['ad_b']) {
    return res.status(400).json({
      detail: 'Both Ad A and Ad B images are required'
    });
  }

  // Check if files are valid images
  const adA = req.files['ad_a'][0];
  const adB = req.files['ad_b'][0];

  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!allowedImageTypes.includes(adA.mimetype) || !allowedImageTypes.includes(adB.mimetype)) {
    return res.status(400).json({
      detail: 'Only JPEG, PNG, and WebP images are allowed'
    });
  }

  next();
};

export const validateVideoUpload = (req, res, next) => {
  // Check if persona_prompt is provided
  if (!req.body.persona_prompt || req.body.persona_prompt.trim().length < 10) {
    return res.status(400).json({
      detail: 'Persona prompt is required and must be at least 10 characters long'
    });
  }

  // Check if both files are uploaded
  if (!req.files || !req.files['ad_a'] || !req.files['ad_b']) {
    return res.status(400).json({
      detail: 'Both Video Ad A and Video Ad B are required'
    });
  }

  // Check if files are valid videos
  const adA = req.files['ad_a'][0];
  const adB = req.files['ad_b'][0];

  const allowedVideoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/webm'];
  
  if (!allowedVideoTypes.includes(adA.mimetype) || !allowedVideoTypes.includes(adB.mimetype)) {
    return res.status(400).json({
      detail: 'Only MP4, MOV, AVI, MKV, and WebM videos are allowed'
    });
  }

  next();
};

export const validateTextAds = (req, res, next) => {
  // Check if persona_prompt is provided
  if (!req.body.persona_prompt || req.body.persona_prompt.trim().length < 10) {
    return res.status(400).json({
      detail: 'Persona prompt is required and must be at least 10 characters long'
    });
  }

  // Check if both text ads are provided
  if (!req.body.ad_a_text || !req.body.ad_b_text) {
    return res.status(400).json({
      detail: 'Both Text Ad A and Text Ad B are required'
    });
  }

  // Check if text ads have minimum length
  if (req.body.ad_a_text.trim().length < 10 || req.body.ad_b_text.trim().length < 10) {
    return res.status(400).json({
      detail: 'Both text ads must be at least 10 characters long'
    });
  }

  next();
};