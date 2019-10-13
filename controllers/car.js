const { Router } = require('express');
const Car = require('../models/cars');
const Booking = require('../models/bookings');
const {authenticate} = require('./middleware/auth');
const router = Router();

router.post('/add',authenticate, (req, res) => {
    const { 
        vehicleNumber, 
        model, 
        seatingCapacity,
    } = req.body;
    Car.create({ vehicleNumber, model, seatingCapacity }, (err, doc) => {
        if(!err) {
            return res.status(200).json({ error: false, message: 'Car added successfully'});
        }
        if (err && err.name === 'MongoError' && err.code === 11000) {
            return res.status(409).json({ error: true, message: 'Car with this vehicle number/model already exists' });
        }
        if (err.name === 'MongoError') {
            return res.status(400).json({ error: true, message: 'Invalid/Incomplete Data' });
        }
        if (err) {
            return res.status(500).json({ error: true, message: 'Internal server error' });
        }
        
    });
});

router.post('/book',authenticate, (req, res) => {
    let {
        customer,
        issueDate,
        returnDate,
        carId,
    } = req.body;

    Car.findOneAndUpdate({ _id: carId, booked: false }, { booked: true, bookingStatus: { customer, issueDate, returnDate } }, (err, doc) => {
        if (err) {
            return res.status(500).json({ error: true, message: 'Internal server error' });
        }
        if (doc === null || doc === undefined) {
            return res.status(200).json({ error: true, message: 'Either car ID is invalid or car is already booked' });
        }
        Booking.create({carId: carId, issueDate: issueDate, endDate:returnDate},(err,d)=>{
            if(err) {
                res.status(400).json({error: true, message:'Bad request'});
            }
        })
        return res.status(200).json({ error: false, message: 'Car booked successfully' });
    });
});

router.post('/available',authenticate,(req,res)=>{
    let {
        startDate,
        endDate,
        capacity
    } = req.body;
    Booking.find({issueDate: {$gte : startDate},endDate: {$lte : endDate}},(err,doc)=>{
        if(err) {
            return res.status(400).json({error: true, message: err});
        }
        carIDs = [];
        for(val in doc) {
            carIDs.push(doc[val].carId);
        }
        Car.find({_id:{$nin:carIDs},seatingCapacity: capacity},(err,r)=>{
            if(err) {
                res.status(400).json({error:true, message: err});
            }
            return res.status(200).json(r);
        })
    })
})

router.post('/carmodel', authenticate,(req,res)=>{
    let {
        model
    } = req.body;
    Car.find({model: model},(err,doc)=>{
        if(err) {
            return res.status(400).json({error : true,message: err});
        }
        return res.status(200).json({doc});
    })
})

router.put('/modifyCar', authenticate,(req,res)=>{
    let {
        id,
        action
    } = req.body;
    if(action===1) {
        Car.find({_id:id},(err,doc)=>{
            if(err) {
                res.status(400).json({error: true, message:err});
            }
            if(!doc.booked) {
                Car.findByIdAndDelete({_id:id},(err,rs)=>{
                    if(err) {
                        res.status(400).json({error: true, message:err});
                    }
                    res.status(200).json({rs,message : "Succesfully deleted"});
                })
            }
        })
    }
})

module.exports = router;