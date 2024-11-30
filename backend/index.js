import express from "express";
import cors from "cors";
import axios from "axios"; 

const app = express();
app.use(express.json()); 

const PORT=3001;
const validation=(validationdata)=>{
    return{
        "ValutionFeePaid":validationdata.ValuationFeePaid?"Passed":"Failed",
        "UkResident":validationdata.UkResident?"Passed":"Failed",
        "RiskRating":validationdata.RiskRating==="Medium"?"Passed":"Failed",
        "Ltvbelow60":validationdata.LTV<60?"Passed":"Failed",
    };

};
app.get('/api/applications/getApplicationById/:id',async(req,res)=>{
    const applicationId=req.params.id; 
    const url=`http://qa-gb.api.dynamatix.com:3100/api/applications/getApplicationById/${applicationId}`;
    try{
        const response= await axios.get(url);
        let data = response.data; 
        let validationItems={
            ValuationFeePaid:data.isValuationFeePaid,
            UkResident:data.isUkResident,
            RiskRating:data.riskRating,
            LTV:data.ltv
        }; 
        const status=validation(validationItems);
        res.send(status);
    }
    catch(error){
        
        console.error("Error: ",error.message);
        res.status(500).json({error:error.message});
    }
});

app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`);
})