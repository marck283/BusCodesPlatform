import { Router } from 'express';
const router = Router();

import Driver from './collezioni/drivercodes.mjs';
import { Validator } from 'node-input-validator';

/**
 * Questo file permette la creazione di codici di autenticazione
 */
router.post('/insert', (req, res) => {
    const v = new Validator({
        idazienda: req.idazienda,
        idutente: req.idutente
    }, {
        idazienda: 'required|string|minLength:1',
        idutente: 'required|string|minLength:16|maxLength:16'
    });
    v.check().then(async matched => {
        if(!matched) {
            console.log(v.errors);
            res.status(400).json({error: "Malformed request."}).send();
            return;
        }
        let driver = await Driver.find({ 'idazienda': { $eq: req.idazienda }, 'idutente': { $eq: req.idutente } });
        if (driver != undefined) {
            res.status(400).json({error: "Driver found."}).send();
            return;
        }

        let newdriver = new Driver({
            idazienda: req.idazienda,
            idutente: req.idutente
        });
        await newdriver.save();
        
        res.status(200).json({message: "Driver created."}).send();
        return;
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: "Internal server error. Please try again later."}).send();
        return;
    })
});

export default router;