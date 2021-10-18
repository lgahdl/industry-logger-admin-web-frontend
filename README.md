# Industry Logger Admin Frontend

# General
## What?

Industry Logger is a software to receive and translate Industrial PLC binary code to be watched anytime, anywhere.`

## How?
With a Raspberry Pi connected via ModBus to the PLC, the raw information(binary) can be sent to our Nest.js Server(see Industry Logger Backend).<br/>
The Admin Frontend is where the technical information is provided to translate the binary into valid data.

# Developer

### Requirements
To run this project you will need:

- Node v12 or greater - [node v12.14.1 (recommended)](https://nodejs.org/download/release/v12.14.1/)

### Steps:
The steps to run this project are:

- Go to the root folder, `.../industry-logger-admin-web-frontend`
- Run `npm install` or `yarn install`.
- Run `npm serve` or `yarn serve`.
- Have fun!

### Important Libraries
The libraries that are important for this project are:
- Vue
- Vuex
- Bootstrap Vue
- Axios
- Lodash
- Vee Validate
- Vue Sweet Alert 2