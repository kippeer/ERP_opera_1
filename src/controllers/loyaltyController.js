const LoyaltyProgram = require('../models/LoyaltyProgram');
const CustomerLoyalty = require('../models/CustomerLoyalty');
const LoyaltyTransaction = require('../models/LoyaltyTransaction');
const Customer = require('../models/Customer');
const { logger } = require('../utils/logger');
const emailService = require('../services/emailService');

exports.createLoyaltyProgram = async (req, res) => {
  try {
    const program = await LoyaltyProgram.create(req.body);
    res.status(201).json(program);
  } catch (error) {
    logger.error(`Error creating loyalty program: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

exports.enrollCustomer = async (req, res) => {
  try {
    const { customer_id, program_id } = req.body;
    
    const existing = await CustomerLoyalty.findOne({
      where: { customer_id, program_id }
    });

    if (existing) {
      return res.status(400).json({ message: 'Customer already enrolled in program' });
    }

    const enrollment = await CustomerLoyalty.create({
      customer_id,
      program_id,
      total_points: 0,
      tier_level: 'bronze'
    });

    const customer = await Customer.findByPk(customer_id);
    await emailService.sendEmail(
      customer.email,
      'welcome_loyalty',
      {
        customer_name: customer.name,
        program_name: (await LoyaltyProgram.findByPk(program_id)).name
      }
    );

    res.status(201).json(enrollment);
  } catch (error) {
    logger.error(`Error enrolling customer in loyalty program: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

exports.awardPoints = async (req, res) => {
  try {
    const { customer_loyalty_id, points, reference_type, reference_id, description } = req.body;

    const customerLoyalty = await CustomerLoyalty.findByPk(customer_loyalty_id);
    if (!customerLoyalty) {
      return res.status(404).json({ message: 'Customer loyalty record not found' });
    }

    const program = await LoyaltyProgram.findByPk(customerLoyalty.program_id);
    const expirationDate = program.expiration_months ? 
      new Date(Date.now() + program.expiration_months * 30 * 24 * 60 * 60 * 1000) : 
      null;

    const transaction = await LoyaltyTransaction.create({
      customer_loyalty_id,
      transaction_type: 'earn',
      points,
      description,
      reference_type,
      reference_id,
      expiration_date: expirationDate
    });

    await customerLoyalty.increment('total_points', { by: points });
    await customerLoyalty.increment('points_earned_ytd', { by: points });
    await customerLoyalty.update({ last_activity_date: new Date() });

    // Update tier level based on YTD points
    const newTier = calculateTierLevel(customerLoyalty.points_earned_ytd);
    if (newTier !== customerLoyalty.tier_level) {
      await customerLoyalty.update({ tier_level: newTier });
      
      const customer = await Customer.findByPk(customerLoyalty.customer_id);
      await emailService.sendEmail(
        customer.email,
        'tier_upgrade',
        {
          customer_name: customer.name,
          new_tier: newTier,
          total_points: customerLoyalty.total_points
        }
      );
    }

    res.json(transaction);
  } catch (error) {
    logger.error(`Error awarding loyalty points: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

exports.redeemPoints = async (req, res) => {
  try {
    const { customer_loyalty_id, points, description } = req.body;

    const customerLoyalty = await CustomerLoyalty.findByPk(customer_loyalty_id);
    if (!customerLoyalty) {
      return res.status(404).json({ message: 'Customer loyalty record not found' });
    }

    if (customerLoyalty.total_points < points) {
      return res.status(400).json({ message: 'Insufficient points balance' });
    }

    const program = await LoyaltyProgram.findByPk(customerLoyalty.program_id);
    if (points < program.minimum_points_redemption) {
      return res.status(400).json({ 
        message: `Minimum redemption is ${program.minimum_points_redemption} points` 
      });
    }

    const transaction = await LoyaltyTransaction.create({
      customer_loyalty_id,
      transaction_type: 'redeem',
      points: -points,
      description,
      reference_type: 'manual'
    });

    await customerLoyalty.decrement('total_points', { by: points });
    await customerLoyalty.increment('points_redeemed_ytd', { by: points });
    await customerLoyalty.update({ last_activity_date: new Date() });

    res.json(transaction);
  } catch (error) {
    logger.error(`Error redeeming loyalty points: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

function calculateTierLevel(pointsEarnedYTD) {
  if (pointsEarnedYTD >= 10000) return 'platinum';
  if (pointsEarnedYTD >= 5000) return 'gold';
  if (pointsEarnedYTD >= 2000) return 'silver';
  return 'bronze';
}