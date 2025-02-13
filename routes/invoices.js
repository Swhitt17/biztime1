const db = require("../db");
const express = require("express");
const router = express.Router();
const ExpressError = require("../expressError");

router.get('/', async(req,res,next) => {
    try{
        const results = await db.query(`SELECT id,comp_code FROM invoices ORDER BY id`);
        return res.json({ invoices: results.rows});
    }
    catch(e){
        return next(e);
    }
})

router.get('/:id', async (req,res,next) => {
    try{
        const {id} = req.params;
        const results = await db.query('SELECT * FROM invoices WHERE id = $1', [id]);
        if(results.rows.length === 0) {
            throw new ExpressError(`Cannot find invoice with id of ${id}`,404);
        }
        return res.json({invoice: results.rows[0]})
    }
    catch(e){
        return next(e);
    }
})

router.post('/',async (req,res,next) => {
    try{
        const {comp_code,amt} = req.body;
        const results = await db.query(`INSERT INTO invoices(comp_code,amt) VALUES ($1,$2) RETURNING *`,[comp_code,amt] );
        return res.status(201).json({invoice: results.rows[0]});

    }
    catch(e){
        return next(e);
    }
})

router.patch('/:id', async (req,res,next) => {
    try{
        const {id} = req.params;
        const {amt} = req.body;
        const results = await db.query('UPDATE invoices SET amt=$1 WHERE id =$2 RETURNING *', [amt,id]);
        if(results.rows.length === 0) {
            throw new ExpressError(`Cannot update invoice with id of ${id}`,404);
        }
        return res.json({invoice: results.rows[0]})
    }
    catch(e){
        return next(e);
    }
})
router.delete('/:id',async (req,res,next) => {
    try{
        const {id} = req.params;
        const results = await db.query(` DELETE FROM invoices WHERE id =$1 RETURNING id`,[id] );
        if(results.rows.length === 0) {
            throw new ExpressError(`Cannot delete invoice with id of ${id}`,404);
        }
        return res.json({status: "deleted"});

    }
    catch(e){
        return next(e);
    }
})





module.exports = router;