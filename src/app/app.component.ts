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
      height: '90%'
    },
    extraCss: {
      position: 'absolute',
      top: '56px',
      left: 0
    }
  };
  modalShow: boolean = false; inputShow: boolean = true;
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
      this.inputShow = false;
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
    this.inputShow = true;
    document.getElementsByTagName('app-root')[0].removeAttribute("style");
  }

  // handles the result emitted by the editor
  editResult(result: Blob) {
    this.modalShow = true;
    alert(this.modalShow);
    let reader = new FileReader();
    reader.onloadend = () => {
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
    document.getElementsByTagName('ngx-doc-scanner')[0].remove();
  }

  modalFn(val: boolean) {
    this.modalShow = false;
    this.inputShow = true;
    document.getElementsByTagName('app-root')[0].removeAttribute("style");
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
    if (document.getElementsByTagName('button')[0] && !(document.getElementsByTagName('button')[0].innerHTML.indexOf('Exit') > 0 || document.getElementsByTagName('button')[0].innerHTML.indexOf('Back') > 0)) {
      let arr = document.getElementsByTagName('button');
      for (let i = 0; i < arr.length; i++) {
        const el = arr[i];
        let text = '';
        switch (el.getAttribute('name')) {
          case 'exit':
            text = 'Exit';
            break;
          case 'rotate':
            text = 'Rotate';
            break;
          case 'done_crop':
            text = 'Done';
            break;
          case 'back':
            text = 'Back';
            break;
          case 'filter':
            text = 'Filter';
            break;
          case 'upload':
            text = 'Next';
            break;
          default:
            break;
        }
        el.innerHTML = el.innerHTML + text;
      }
    }
  }
}
