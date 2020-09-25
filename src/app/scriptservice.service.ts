import { Injectable } from '@angular/core';


interface Scripts {
  name: string;
  src: string;
}
export const ScriptStore: Scripts[] = [
  { name: 'slim', src: 'https://code.jquery.com/jquery-3.5.1.slim.min.js' },
  { name: 'popper', src: 'https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js' },
  { name: 'bootstrap', src: 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js'},
  { name: 'ionicons', src: 'https://cdnjs.cloudflare.com/ajax/libs/ionicons/5.1.2/index.min.js'},
  { name: 'wow', src: 'https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js'}, 

];

@Injectable({
  providedIn: 'root'
})
export class ScriptserviceService {
  private scripts: any = {};
  constructor() { 
    ScriptStore.forEach((script: any) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src
      };
    });
  }

  load(...scripts: string[]) {
    const promises: any[] = [];
    scripts.forEach((script) => promises.push(this.loadScript(script)));
    return Promise.all(promises);
  }

  loadScript(name: string) {
    return new Promise((resolve, reject) => {
      // resolve if already loaded
      if (this.scripts[name].loaded) {
        resolve({ script: name, loaded: true, status: 'Already Loaded' });
      } else {
        // load script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        script.onload = () => {
          this.scripts[name].loaded = true;
          console.log(`${name} Loaded.`);
          resolve({ script: name, loaded: true, status: 'Loaded' });
        };
        script.onerror = (error: any) => resolve({ script: name, loaded: false, status: 'Loaded' });
        document.getElementsByTagName('head')[0].appendChild(script);
      }
    });
  }

}
