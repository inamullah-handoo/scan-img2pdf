import { Component } from '@angular/core';
import { DocScannerConfig } from 'ngx-document-scanner/lib/PublicModels';
import { jsPDF } from "jspdf";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  overZone = false;
  image: File | any;
  processing: boolean | any;
  fn: boolean | any;
  config: DocScannerConfig = {
    editorBackgroundColor: '#fff',
    buttonThemeColor: 'primary',
    cropToolColor: '#ff4081',
    cropToolShape: 'rect',
    cropToolDimensions: {
      width: 16,
      height: 16
    },
    exportImageIcon: 'arrow_forward',
    editorDimensions: {
      width: '100%',
      height: '100%'
    },
    extraCss: {
      position: 'absolute',
      top: 0,
      left: 0
    }
  };
  modalShow: boolean = false;
  doc = new jsPDF();


  constructor() { }

  // ******************* //
  // file input handlers //
  // ******************* //
  dropFile(event: any) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files.item(0)) {
      const file = event.dataTransfer.files.item(0);
      if (this.isImage(file)) {
        this.loadFile(file);
      } else {
        this.overZone = false;
      }
    }
  }

  loadFile(event: any) {
    this.processing = true;
    this.overZone = false;
    let f: File;
    if (event instanceof File) {
      f = event;
    } else {
      const files = event.target.files;
      f = files[0];
    }
    if (f && this.isImage(f)) {
      this.image = f;
    } else {
      alert("This file type is not supported");
    }
  }

  isImage(file: File) {
    const types = [
      'image/png',
      'image/jpeg',
      'image/jpg',
    ];
    return types.findIndex(type => {
      return type === file.type;
    }) !== -1;
  }


  // ******************************** //
  // bindings to doc scanner component//
  // ******************************** //
  // resets the file input when the user exits the editor
  exitEditor(message: any) {
    console.log(message);
    this.image = null;
  }

  // handles the result emitted by the editor
  editResult(result: Blob) {
    let reader = new FileReader();
    reader.onloadend = async () => {
      this.image = null;
      const imgProps = this.doc.getImageProperties(String(reader.result));
      const margin = 0.1;
      const pdfWidth = this.doc.internal.pageSize.width * (1 - margin);
      const pdfHeight = this.doc.internal.pageSize.height * (1 - margin);
      const x = this.doc.internal.pageSize.width * (margin / 2);
      const y = this.doc.internal.pageSize.height * (margin / 2);
      const widthRatio = pdfWidth / imgProps.width;
      const heightRatio = pdfHeight / imgProps.height;
      const ratio = Math.min(widthRatio, heightRatio);
      const w = imgProps.width * ratio;
      const h = imgProps.height * ratio;
      this.doc.addImage(String(reader.result), "JPEG", x, y, w, h);
    };
    reader.readAsDataURL(result);
    this.modalShow = true;
    document.getElementsByTagName('ngx-doc-scanner')[0].remove();
  }

  modalFn(val: boolean) {
    this.modalShow = false;
    if (val) {
      this.doc.addPage();
    } else {
      alert('Saving as Pdf...');
      this.doc.save(`img2pdf_${new Date().toLocaleString()}.pdf`);
    }
  }

  // handles errors emitted by the component
  onError(err: Error) {
    console.error(err);
  }

  // handles changes in the editor state - is it processing or not
  editorState(processing: any) {
    this.processing = null;
    this.processing = processing;
  }
}
