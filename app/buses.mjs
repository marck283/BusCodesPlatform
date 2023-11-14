import { Router } from 'express';
const router = Router();

import Bus from './collezioni/buses.mjs';
import { Validator } from 'node-input-validator';

router.post('/add', (req, res) => {
    const v = new Validator({
        targa: req.targa,
        capacita: req.capacita
    }, {
        targa: 'required|string|minLength:1',
        capacita: 'required|between:0,350'
    });
    v.check().then(async matched => {
        if(!matched) {
            console.log(v.errors);
            res.status(400).json({error: "Malformed request."}).send();
            return;
        }
        
        let bus = Bus.find({targa: {$eq: req.targa}});
        if(bus != undefined) {
            res.status(400).json({error: "Bus found."}).send();
            return;
        }

        let newbus = new Bus({
            targa: req.targa,
            capacita: req.capacita
        });
        await newbus.save();

        res.status(201).json({message: "Bus added."}).send();
        return;
    })
    .check(err => {
        console.log(err);
        res.status(500).json({error: "Internal server error. Please try again later."}).send();
        return;
    })
});