import {Observable, Observer} from 'rxjs';
import {Candidate} from '../domain/candidate';
import {DynamoDB, SES} from "aws-sdk";

import DocumentClient = DynamoDB.DocumentClient;

var uuid = require('uuid');
var AWS = require("aws-sdk");
var csv = require('csv');
var obj = csv();



AWS.config.update({
    region: "us-east-1"
});

export interface CandidateService {
    getAll(): Observable<Candidate[]>;
    create(data: any): Observable<Candidate>;
    find(candidateId:string) : Observable<Candidate>;
    update(data: any): Observable<Candidate>;
}

export class CandidateServiceImpl implements CandidateService {

    constructor() {

    }

    sendEmail(email, messageBody) {
            const emailConfig = {
                region: 'us-east-1'
            };

            const emailSES = new SES(emailConfig);

            const p = new Promise((res, rej)=>{

                if(!email || !messageBody) {
                    rej('Please provide email and message');
                    return;
                }

                const emailParams: AWS.SES.SendEmailRequest = this.createEmailParamConfig(email, messageBody);
                emailSES.sendEmail(emailParams, (err:any, data: AWS.SES.SendEmailResponse) => {
                    if(err) {
                        console.log(err);
                        rej(`Error in sending out email ${err}`)
                        return;
                    }

                    res(`Successfully sent email to ${email}`);

                });

            });
    }


    create(data: any): Observable<Candidate> {
        console.log("in CandidateServiceImpl create()");
        const documentClient = new DocumentClient();

        const params = {
            TableName: "candidates",
            Item: {
                candidateId: data.candidateId,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phoneNumber: data.phoneNumber
            },
            ConditionExpression: "attribute_not_exists(candidateId)"
        };

        return Observable.create((observer:Observer<Candidate>) => {

            documentClient.put(params, (err, data: any) => {
                if(err) {
                    if(err.code === 'ConditionalCheckFailedException'){
                        console.error('candidate already exists',data.candidateId);
                        observer.error(err);
                        return;
                    }
                }

                observer.next(data.Item[0]);
                observer.complete();
            });
        });


    }


    update(data: any): Observable<Candidate> {
        
     //let s3 = new AWS.S3({apiVersion: '2006-03-01'});



new AWS.S3().getObject({ Bucket:'candidatedatafile' , Key: 'OutWit guess export - IT_Services_in_Bangalore_Karnataka_India.csv' }, function(err, data)
{
    if (!err)
          
          
             var letterNumber = /^[0-9]+$/;
                  
               var  a=data.Body.toString();
                        
                console.log("a= "+a);
                        
                //console.log("First name= "+ a.split(";")[0].substr(0,a.split(";")[0].indexOf(' ')));
                //console.log("Last name= "+a.split(";")[0].substr(a.split(";")[0].indexOf(' ')+1));
                //console.log("Phone number= "+a.split(";")[7].substring(0, 10).match(letterNumber) && a.split(";")[7].substring(0, 10).length === 10 ? a.split(";")[7].substring(0, 10) : '----------');
                //console.log("Email= "+a.split(";")[1]);
           
           
});


    /*  const documentClient = new DocumentClient();

obj.from.path('./datafile/OutWit guess export - IT_Services_in_Bangalore_Karnataka_India.csv').to.array(function (data1) {
    for (var index = 0; index < data1.length; index++) {
      for (var index1 = 0; index1 < data1[index].length; index1++) {
                                      
              var a=((data1[index])[index1]);           
              var letterNumber = /^[0-9]+$/;
              let uid=uuid.v4();
              console.log("uid= "+uid+" index= "+index);
        const params = {
            TableName: "candidate",
            Key: {
                candidateId:uid ,
            },
            ExpressionAttributeNames: {
                '#fn': 'firstName',
                '#ln': 'lastName',
                '#ph': 'phoneNumber',
                '#em': 'email',
            },
            ExpressionAttributeValues: {
                ':fn': a.split(";")[0].substr(0,a.split(";")[0].indexOf(' ')),
                ':ln': a.split(";")[0].substr(a.split(";")[0].indexOf(' ')+1),
                ':ph': a.split(";")[7].substring(0, 10).match(letterNumber) && a.split(";")[7].substring(0, 10).length === 10 ? a.split(";")[7].substring(0, 10) : '----------',
                ':em': a.split(";")[1],
            },
            UpdateExpression: 'SET #fn = :fn, #ln = :ln, #ph = :ph, #em = :em ',
            //ConditionExpression : "attribute_not_exists(:em)",
            ConditionExpression: 'attribute_not_exists(#em)', 

            ReturnValues: 'ALL_NEW',
        };


      documentClient.update(params, (err, data: any) => {
                if(err) {
                    console.error(err);
                  
                    return;
                }
                            
            });
          }

  }

});






   /*                 
var uploadParams = {Bucket: 'candidatedatafile', Key: '', Body: ''};
var file = './datafile/OutWit guess export - IT_Services_in_Bangalore_Karnataka_India.csv';

var fs = require('fs');
var fileStream = fs.createReadStream(file);
fileStream.on('error', function(err) {
  console.log('File Error', err);
});
uploadParams.Body = fileStream;

var path = require('path');
uploadParams.Key = path.basename(file);

// call S3 to retrieve upload file to specified bucket
s3.upload (uploadParams, function (err, data) {
  if (err) {
    console.log("Error", err);
  } if (data) {
    console.log("Upload Success", data.Location);
  }
});
*/




    
        return Observable.create((observer:Observer<Candidate>) => {
      
        });
    }


    find(candidateId:string): Observable<Candidate> {
        console.log("in CandidateServiceImpl find()");

        const queryParams: DynamoDB.Types.QueryInput = {
            TableName: "candidates",
            ProjectionExpression: "candidateId, firstName, lastName, email, phoneNumber",
            KeyConditionExpression: "#candidateId = :candidateIdFilter",
            ExpressionAttributeNames:{
                "#candidateId": "candidateId"
            },
            ExpressionAttributeValues: {
                ":candidateIdFilter": candidateId
            }
        }

        const documentClient = new DocumentClient();
        return Observable.create((observer:Observer<Candidate>) => {
            console.log("Executing query with parameters " + queryParams);
            documentClient.query(queryParams,(err,data:any) => {
                console.log(`did we get error ${err}`);
                if(err) {
                    observer.error(err);
                    throw err;
                }
                console.log(`data items receieved ${data.Items.length}`);
                if(data.Items.length === 0) {
                    console.log("no data received for getAll candidates");
                    observer.complete();
                    return;
                }
                data.Items.forEach((item) => {
                    console.log(`candidate Id ${item.candidateId}`);
                    console.log(`candidate firstName ${item.firstName}`);
                    console.log(`candidate lastName ${item.lastName}`);
                    console.log(`candidate email ${item.email}`);
                });
                observer.next(data.Items[0]);
                observer.complete();

            });
        });

    }

    getAll(): Observable<Candidate[]> {
        console.log("in CandidateServiceImpl getAll()");

        const queryParams: DynamoDB.Types.QueryInput = {
            TableName: "candidates",
            ProjectionExpression: "candidateId, firstName, lastName, email, phoneNumber",
            KeyConditionExpression: "#candidateId = :candidateIdFilter",
            ExpressionAttributeNames:{
                "#candidateId": "candidateId"
            },
            ExpressionAttributeValues: {
                ":candidateIdFilter": "1"
            }
        }

        const documentClient = new DocumentClient();
        return Observable.create((observer:Observer<Candidate>) => {
            console.log("Executing query with parameters " + queryParams);
            documentClient.query(queryParams,(err,data:any) => {
                console.log(`did we get error ${err}`);
                if(err) {
                    observer.error(err);
                    throw err;
                }
                console.log(`data items receieved ${data.Items.length}`);
                if(data.Items.length === 0) {
                    console.log("no data received for getAll candidates");
                    observer.complete();
                    return;
                }
                data.Items.forEach((item) => {
                    console.log(`candidate Id ${item.candidateId}`);
                    console.log(`candidate firstName ${item.firstName}`);
                    console.log(`candidate lastName ${item.lastName}`);
                    console.log(`candidate email ${item.email}`);
                });
                observer.next(data.Items);
                observer.complete();

            });

        });

    }

   private createEmailParamConfig(email, message): AWS.SES.SendEmailRequest {
       const params = {
           Destination: {
               BccAddresses: [],
               CcAddresses: [],
               ToAddresses: [ email ]
           },
           Message: {
               Body: {
                   Html: {
                       Data: this.generateEmailTemplate("umesh@amitisoft.com", message),
                       Charset: 'UTF-8'
                   }
               },
               Subject: {
                   Data: 'Testing Email',
                   Charset: 'UTF-8'
               }
           },
           Source: 'umesh@amitisoft.com',
           ReplyToAddresses: [ 'umesh@amitisoft.com' ],
           ReturnPath: 'umesh@amitisoft.com'
       }
       return params;
   }

   private generateEmailTemplate(emailFrom:string, message:string) : string {
       return `
         <!DOCTYPE html>
         <html>
           <head>
             <meta charset='UTF-8' />
             <title>title</title>
           </head>
           <body>
            <table border='0' cellpadding='0' cellspacing='0' height='100%' width='100%' id='bodyTable'>
             <tr>
                 <td align='center' valign='top'>
                     <table border='0' cellpadding='20' cellspacing='0' width='600' id='emailContainer'>
                         <tr style='background-color:#99ccff;'>
                             <td align='center' valign='top'>
                                 <table border='0' cellpadding='20' cellspacing='0' width='100%' id='emailBody'>
                                     <tr>
                                         <td align='center' valign='top' style='color:#337ab7;'>
                                             <h3><a href="http://mail.amiti.in/verify.html?token=${message}">http://mail.amiti.in/verify.html?token=${message}</a>
                                             </h3>
                                         </td>
                                     </tr>
                                 </table>
                             </td>
                         </tr>
                         <tr style='background-color:#74a9d8;'>
                             <td align='center' valign='top'>
                                 <table border='0' cellpadding='20' cellspacing='0' width='100%' id='emailReply'>
                                     <tr style='font-size: 1.2rem'>
                                         <td align='center' valign='top'>
                                             <span style='color:#286090; font-weight:bold;'>Send From:</span> <br/> ${emailFrom}
                                         </td>
                                     </tr>
                                 </table>
                             </td>
                         </tr>
                     </table>
                 </td>
             </tr>
             </table>
           </body>
         </html>
`
   }

}
