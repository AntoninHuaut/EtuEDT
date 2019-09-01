# EtuEDT
A Node.js app using [Express 4](http://expressjs.com/) and [FullCalendar v4](https://fullcalendar.io/).

## Getting Started
This application was created to quickly access the timetables of the University of Caen via the Zimbra service.  
[*Application demo*](https://edt.maner.fr/ "Application demo")

## Running Locally
> The use of the application requires changes in the code  
> Timetables must be shared with the main account used

```shell
$ git clone https://github.com/Manerr/EtuEDT.git && cd EtuEDT/
$ npm install
$ mv config_template.json config.json && nano config.json
$ npm start
```

If everything went well, your app should now be running on [localhost:3005](http://localhost:3005/).