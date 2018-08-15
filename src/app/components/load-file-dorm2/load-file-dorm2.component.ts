import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import * as xlsx from "xlsx";
import * as _ from "lodash";
import * as jspdf from "jspdf";
import * as html2canvas from "html2canvas";

@Component({
    selector: "#loadFile2",
    templateUrl: "./load-file-dorm2.component.html",
    styleUrls: ["./load-file-dorm2.style.css"]
})

export class LoadFileDorm2Components implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;
    excelJsonData: any= [];
    pages: any =[];
    pdfFile: any;
    isAllowPDFDownload: boolean = false;
    isAllowPDFGen: boolean = false;

    constructor(
        private router: Router) { }
 
    ngOnInit() {
        this.loading = false;
    }

    SheetJSImportDirective(event: any){
        var files = event.srcElement.files;
        let file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = (e: any) => {
            /* read workbook */
            debugger;
            var bstr = e.target.result;
            var workbook = xlsx.read(bstr, {type:'binary'});
            this.isAllowPDFDownload = false;
            this.isAllowPDFGen= false;
            /* grab first sheet */
            var wsname = workbook.SheetNames[0];
            var ws = workbook.Sheets[wsname];

            /* grab first row and generate column headers */
            var aoa = xlsx.utils.sheet_to_json(ws, {header:1, raw:false});
            var cols = [];
            let len: any = [];
            len = aoa[0];
            for(var i = 0; i < len.length ; ++i) cols[i] = { field: aoa[0][i] };

            /* generate rest of the data */
            var data = [];
            for(var r = 1; r < aoa.length; ++r) {
                data[r-1] = {};
                let ren: any = aoa[r];
                for(i = 0; i < ren.length; ++i) {
                if(aoa[r][i] == null) continue;
                data[r-1][aoa[0][i]] = aoa[r][i]
                }
            }
            this.displayReceipt(data);

          };
  
          reader.readAsBinaryString(file);
    }
    displayReceipt(data: any){
        this.excelJsonData = this.transformData(data);
        const pageNumbers = Math.round(this.excelJsonData.length/2);
        for(let i=0; i< pageNumbers; i++) {
            let j=i*2;
            let k=0;
            let reports = [];
            let receipts=[];
            while(j< this.excelJsonData.length && k<2){
                receipts.push({ data: this.excelJsonData[j], roomNumber: this.excelJsonData[j][0].value});
                reports.push({ data: this.excelJsonData[j], roomNumber: this.excelJsonData[j][0].value})
                
                j++;
                k++;
            }
            this.pages.push({
                pageNumber: "page"+i,
                reports: reports,
                receipts: receipts,
                month: this.getCurrentMonth()
            });
        }
        this.isAllowPDFDownload = false;
        this.isAllowPDFGen= true;
    }
    convertToPDF(jsonData: any) {
        debugger;
        console.log(this.excelJsonData);
    }

    transformData(data: any) {
        let array= [];
        _.each(data, function (value, key) {
            let models = [];
            models.push({
                key: "ห้องเลขที่",
                value: value.RoomNumber
            });
            models.push({
                key: "ค่าเช่า",
                value: value.rentalCost
            });
            models.push({
                key: "น้ำประปา" ,
                value: value.water
            });
            models.push({
                key: "ไฟฟ้า( "+ value.electricityCurrent  +' - ' + value.electricityPreviousMonth + ') * '+ value.costPerElectricity,
                value: value.electricity
            });
            models.push({
                key: "ค่าบริการมาตรฐาน + Internent",
                value: value.standardService==0 ? '-':value.standardService
            });
            models.push({
                key: "รวม",
                value: value.total
            });
            array.push(models);
        });
        return array
    }

    getCurrentMonth(){
        let month = new Array();
        month[0] = "มกราคม";
        month[1] = "กุมภาพันธ์";
        month[2] = "มีนาคม";
        month[3] = "เมษายน";
        month[4] = "พฤษภาคม";
        month[5] = "มิถุนายน";
        month[6] = "กรกฎาคม";
        month[7] = "สิงหาคม";
        month[8] = "กันยายน";
        month[9] = "ตุลาคม";
        month[10] = "พฤศจิกายน";
        month[11] = "ธันวาคม";

    var d = new Date();
    return month[d.getMonth()];
    }

    captureScreen()  {  
        let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
        var position = 0; 
        var options = {
            pagesplit: true
        };
        let last = this.pages.length - 1;
        for(let i=0; i< this.pages.length; i++){
            var data = document.getElementById(this.pages[i].pageNumber);
            
            html2canvas(data).then(canvas => {  
                // Few necessary setting options  
                var imgWidth = 208;   
                var pageHeight = 295;    
                var imgHeight = canvas.height * imgWidth / canvas.width;  
                var heightLeft = imgHeight;  
                const contentDataURL = canvas.toDataURL('image/png') ;
                pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
                pdf.addPage();
                debugger;
                if(i == last){
                    this.isAllowPDFDownload = true;
                    this.isAllowPDFGen= true;
                }
            }); 
        } // Generated PDF  
        this.pdfFile =  pdf;
        
    }  
    downloadFile(){
        this.pdfFile.save("test.pdf");
    }
}