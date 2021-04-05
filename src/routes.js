const express = require('express');
const routes = express.Router();

const basePath = __dirname + "/views/";

const Profile = {
    data: {
        name: "Henrique Malikovski",
        avatar: "https://github.com/henriquemalikovski.png",
        "monthly-budget": 3000,
        "days-per-week": 5,
        "hours-per-day": 5,
        "vacation-per-year": 4,
        valueHour: 75
    },

    controllers: {
        index(req, res) {
            return res.render(basePath + "profile", { profile: Profile.data });
        },

        update(req, res) {
            const data = req.body;
            const weeksPerYear = 52;
            const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12;
            const weekTotalHours = data["hours-per-day"] * data["days-per-week"];
            const monthlyTotalHours = weekTotalHours * weeksPerMonth;
            const value = data["monthly-budget"] / monthlyTotalHours;

            Profile.data = {
                ...Profile.data,
                ...req.body,
                "valueHour": value
            };

            return res.redirect("/profile");
        }
    }
}

const Job = {
    data: [
        {
            id: 1,
            name: "Pizzaria Guloso",
            "daily-hours": 2,
            "total-hours": 1,
            createdAt: Date.now(),
            budget: 4500
        },
        {
            id: 2,
            name: "OneTwo Projects",
            "daily-hours": 3,
            "total-hours": 47,
            createdAt: Date.now(),
            budget: 4500
        }
    ],

    controllers: {
        index(req, res) {
            const updatedJobs = Job.data.map((job) => {
        
                const remaining = Job.services.remainingDays(job);
                const status = remaining <= 0 ? "done" : "progress";
        
                return {
                    ...job,
                    remaining,
                    status,
                    budget: Job.services.calculeteBudget(job, Profile.data["valueHour"]),
                };
            })
            
            return res.render(basePath + "index", { jobs: updatedJobs });
        },
        save(req, res) {
            // req.body => { name: 'Teste', 'daily-hours': '3', 'total-hours': '3' }
            const job = req.body;
            const jobId = Job.data[Job.data.length - 1]?.id || 0;

            Job.data.push({
                id: jobId + 1,
                name: job.name,
                "daily-hours": job["daily-hours"],
                "total-hours": job["total-hours"],
                createdAt: Date.now(),
            }); 
            return res.redirect("/");
        },
        create(req, res) {
            return res.render(basePath + "job")
        },
        show(req, res) {

            const jobId = req.params.id;

            const job = Job.data.find(job => Number(job.id) === Number(jobId));

            if(!job){
                return res.send("Job not found!");
            }

            job.budget = Job.services.calculeteBudget(job, Profile.data["valueHour"]);


            return res.render(basePath + "/job-edit", { job })   
        },
        update(req, res) {
            const jobId = req.params.id;

            const job = Job.data.find(job => Number(job.id) === Number(jobId));

            if( !job ){
                return res.send("Job not found!");
            }
            const updatedJob = {
                ...job,
                name: req.body.name,
                "total-hours": req.body["total-hours"],
                "daily-hours": req.body["daily-hours"],
            }

            Job.data = Job.data.map(job => {
                if(Number(job.id) === Number(jobId)){
                    job = updatedJob;
                }
                return job;
            })

            return res.redirect("/job/" + jobId);
        },
        delete(req, res) {
            const jobId = req.params.id;

            Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId));

            return res.redirect("/");
        }
    },

    services: {
        remainingDays(job) {
            //Ajustes no job
            //calculo de tempo restante
            const remainingDays = (job['total-hours'] / job['daily-hours']).toFixed();
            const createdDate = new Date(job.createdAt);
            const dueDay = createdDate.getDate() + Number(remainingDays);
            const dueDate = createdDate.setDate(dueDay);
            
            const timeDiffInMs = dueDate - Date.now();
            // transformart milisec em dias
            const dayInMs = 1000 * 60 * 60 * 24;
            const dayDiff = Math.floor(timeDiffInMs / dayInMs);
        
            return dayDiff;
        },
        calculeteBudget: (job, valueHour) => valueHour * job['total-hours']
    }
}

// request, response
routes.get("/", Job.controllers.index);
routes.get("/job", Job.controllers.create);
routes.post("/job", Job.controllers.save);
routes.get("/job/:id", Job.controllers.show);
routes.post("/job/:id", Job.controllers.update);
routes.post("/job/delete/:id", Job.controllers.delete);
routes.get("/profile", Profile.controllers.index);
routes.post("/profile", Profile.controllers.update);

module.exports = routes;