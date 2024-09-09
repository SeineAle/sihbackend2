import FormData from 'form-data';
import Mailgun from 'mailgun.js';

  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({username: 'api', key: '4956000509877c1ba2c9d9d06953f28c-2b755df8-18efe6c5'});
  
  mg.messages.create('sandbox01d43b4f73f84d8cb01fae14dddc7d57.mailgun.org', {
  	from: "Excited User <mailgun@sandbox01d43b4f73f84d8cb01fae14dddc7d57.mailgun.org>",
  	to: ["paras.jain.real@gmail.com"],
  	subject: "Hello",
  	text: "Testing some Mailgun awesomeness!",
  	html: "<h1>Testing some Mailgun awesomeness!</h1>"
  })
  .then(msg => console.log(msg)) // logs response data
  .catch(err => console.log(err)); // logs any error