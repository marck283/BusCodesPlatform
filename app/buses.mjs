import { Router } from 'express';
const router = Router();

import Bus from './collezioni/buses.mjs';
import { Validator } from 'node-input-validator';

router.post('/add', (req, res) => {
    const v = new Validator({
        targa: req.targa,
        capacita: req.capacita
    }, {
        targa: 'required|string|minLength:1|maxLength:8',
        capacita: 'required|between:0,350'
    });
    v.check().then(async matched => {
        if (!matched) {
            console.log(v.errors);
            res.status(400).json({ error: "Malformed request." }).send();
            return;
        }

        let bus = Bus.find({ targa: { $eq: req.targa } });
        if (bus != undefined) {
            res.status(400).json({ error: "Bus found." }).send();
            return;
        }

        let newbus = new Bus({
            targa: req.targa,
            capacita: req.capacita,
            numPersone: 0
        });
        await newbus.save();

        res.status(201).json({ message: "Bus added." }).send();
        return;
    })
        .check(err => {
            console.log(err);
            res.status(500).json({ error: "Internal server error. Please try again later." }).send();
            return;
        })
});

var getBus = async targa => {
    let bus = await Bus.find({ targa: { $eq: targa } });
    if (bus == undefined) {
        res.status(404).json({ error: "Bus with ID " + targa + " not found." }).send();
        return;
    }

    return bus[0];
};

var incrementPeople = async targa => {
    let bus = getBus(targa);
    bus[0].numPersone = bus[0].numPersone + 1;
    await bus.save();
};

var checkTarga = targa => {
    const v = new Validator({
        targa: targa
    }, {
        targa: 'required|string|minLength:1|maxLength:8'
    });
    return v.check();
}

router.patch('/incrementPeople', (req, res) => {
    checkTarga(req.targa).then(async matched => {
        if (!matched) {
            console.log(v.errors);
            res.status(400).json({ error: "Malformed request." }).send();
            return;
        }

        incrementPeople(req.targa);

        res.status(200).json({ message: "Bus updated successfully!" }).send();
        return;
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: "Internal server error. Please try again later." }).send();
        return;
    });
});

var decrementPeople = async targa => {
    let bus = getBus(targa);
    bus[0].numPersone = bus[0].numPersone - 1;
    await bus.save();
}

router.patch('/decrementPeople', (req, res) => {
    checkTarga(targa).then(async matched => {
        if(!matched) {
            console.log(v.errors);
            res.status(400).json({error: "Malformed request."}).send();
            return;
        }
        
        decrementPeople(targa);

        res.status(200).json({message: "Bus updated successfully!"}).send();
        return;
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: "Internal server error. Please try again later." }).send();
        return;
    })
});

export default router;