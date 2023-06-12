/**
 * This script is used to format the data from the open-cookie-database.csv file and write it back to open-cookie-database.json file.
 */
const fs = require('fs-extra');
const path = require('path');
const csvtojson = require('csvtojson');
const process = require('process');
const targetDIR = path.resolve(__dirname, '..', 'data');
const requestURL =
  'https://raw.githubusercontent.com/jkwakman/Open-Cookie-Database/master/open-cookie-database.csv';

/**
 * Format the raw csv data to a JSON object and return it.
 *
 * @param {string} rawData string representation of the csv file.
 * @returns {Object} JSON object.
 */
const formatRawData = async (rawData) => {
  // Object to store the formatted data.
  let formattedData = {};

  // Convert the csv string to a JSON object.
  let cookies = await csvtojson().fromString(rawData);

  // Format the data.
  cookies.forEach((cookie) => {
    const key = cookie['Cookie / Data Key name'];
    const controller = cookie['Data Controller'];
    const retention = cookie['Retention period'];
    const gdpr = cookie['User Privacy & GDPR Rights Portals'];
    const wildCard = cookie['Wildcard match'];

    // Remove the keys we don't need.
    delete cookie['Cookie / Data Key name'];
    delete cookie['Data Controller'];
    delete cookie['Retention period'];
    delete cookie['User Privacy & GDPR Rights Portals'];
    delete cookie['Wildcard match'];

    // Add the keys we do need.
    cookie['Key'] = key;
    cookie['DataController'] = controller;
    cookie['Retention'] = retention;
    cookie['GDPR'] = gdpr;
    cookie['Wildcard'] = `${wildCard}`;

    // Add the cookie to the formatted data.
    formattedData[key] = [cookie, ...(formattedData[key] || [])];
  });

  return formattedData;
};

/**
 * Handle errors that occur during the download or formatting of the csv file and exit the process.
 *
 * @param {Error} err
 */
const errorHandler = (err) => {
  console.error(err.message);
  process.exit(1);
};

/**
 * Download the csv file from the Open Cookie DB, format the data and write it to open-cookie-database.json.
 */
const main = async () => {
  console.log('Downloading the csv file from the Open Cookie DB...');
  try {
    const response = await fetch(requestURL);

    if (!response.ok) {
      errorHandler(
        new Error(`Request Failed. Status Code: ${response.status}`)
      );
    }

    const rawData = await response.text();
    console.log('Downloaded the csv file from the Open Cookie DB.\n');
    console.log('Formatting the data...');

    // Format the raw data.
    let formattedData = await formatRawData(rawData);

    await fs.ensureFile(path.resolve(targetDIR, 'open-cookie-database.json'));
    // Write the formatted data to a file.
    await fs.writeFile(
      path.resolve(targetDIR, 'open-cookie-database.json'),
      JSON.stringify(formattedData, null, 2)
    );

    console.log('Formatted data written to open-cookie-database.json file.');
  } catch (error) {
    errorHandler(error);
  }
};

// Run the script.
main();
