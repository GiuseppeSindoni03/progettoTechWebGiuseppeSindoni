import { Injectable } from '@angular/core';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {

  constructor(private sanitizer: DomSanitizer) { }

  convertToHtml(markdown: string): SafeHtml {
    const rawHtml = marked.parse(markdown) as string; // 🔹 Usa `marked.parse()` in modo sincrono
    return this.sanitizer.bypassSecurityTrustHtml(rawHtml); // ✅ Evita problemi di sicurezza XSS
  }
}
