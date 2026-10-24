// server/src/ai/documentProcessor.js
// Local offline document text extractor and section chunker.
// Supports TXT, MD, JSON, and extracted PDF text streams.
// 100% OFFLINE, ZERO CLOUD.

import fs from 'fs';
import path from 'path';

const DOCS_BASE_DIR = path.resolve(process.cwd(), 'Viva_Records', 'Documents');

export class DocumentProcessor {
  constructor() {
    this.ensureBaseDir();
  }

  ensureBaseDir() {
    if (!fs.existsSync(DOCS_BASE_DIR)) {
      fs.mkdirSync(DOCS_BASE_DIR, { recursive: true });
    }
  }

  getFacultyDocDir(facultyId, subjectId) {
    const cleanFaculty = String(facultyId || 'FACULTY_DEFAULT').replace(/[^a-zA-Z0-9_\-]/g, '_');
    const cleanSubject = String(subjectId || 'GENERAL').replace(/[^a-zA-Z0-9_\-]/g, '_');
    const target = path.join(DOCS_BASE_DIR, cleanFaculty, cleanSubject);
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target, { recursive: true });
    }
    return target;
  }

  /**
   * Ingest and chunk reference text
   */
  processTextDocument(facultyId, subjectId, filename, textContent, metadata = {}) {
    this.ensureBaseDir();
    const dir = this.getFacultyDocDir(facultyId, subjectId);
    const safeName = String(filename || `doc_${Date.now()}.txt`).replace(/[^a-zA-Z0-9_\-\.]/g, '_');
    const filePath = path.join(dir, safeName);

    // Write original file locally
    fs.writeFileSync(filePath, textContent, 'utf-8');

    // Chunk into meaningful conceptual passages
    const chunks = this.chunkText(textContent, safeName, metadata);

    // Save indexed chunks metadata
    const chunksPath = path.join(dir, `${safeName}.chunks.json`);
    fs.writeFileSync(chunksPath, JSON.stringify(chunks, null, 2), 'utf-8');

    return {
      success: true,
      filename: safeName,
      filePath,
      chunksCount: chunks.length,
      chunks
    };
  }

  /**
   * Split document text into ~500 character semantic chunks with overlap
   */
  chunkText(text, sourceName, metadata = {}) {
    if (!text || typeof text !== 'string') return [];
    
    // Split by paragraphs or double newlines first
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 20);
    const chunks = [];

    paragraphs.forEach((p, idx) => {
      const cleanPara = p.trim();
      if (cleanPara.length <= 800) {
        chunks.push({
          id: `${sourceName}_chk_${idx}`,
          sourceFile: sourceName,
          section: metadata.section || `Section ${idx + 1}`,
          page: metadata.page || Math.floor(idx / 3) + 1,
          text: cleanPara,
          keywords: this.extractKeywords(cleanPara)
        });
      } else {
        // Subdivide large paragraphs
        const sentences = cleanPara.match(/[^.!?]+[.!?]+(\s+|$)/g) || [cleanPara];
        let currentChunk = '';
        let subIdx = 0;
        sentences.forEach(s => {
          if ((currentChunk + s).length > 600) {
            chunks.push({
              id: `${sourceName}_chk_${idx}_${subIdx++}`,
              sourceFile: sourceName,
              section: metadata.section || `Section ${idx + 1}`,
              page: metadata.page || Math.floor(idx / 3) + 1,
              text: currentChunk.trim(),
              keywords: this.extractKeywords(currentChunk)
            });
            currentChunk = s;
          } else {
            currentChunk += s;
          }
        });
        if (currentChunk.trim().length > 0) {
          chunks.push({
            id: `${sourceName}_chk_${idx}_${subIdx}`,
            sourceFile: sourceName,
            section: metadata.section || `Section ${idx + 1}`,
            page: metadata.page || Math.floor(idx / 3) + 1,
            text: currentChunk.trim(),
            keywords: this.extractKeywords(currentChunk)
          });
        }
      }
    });

    return chunks;
  }

  extractKeywords(text) {
    const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
    const stopWords = new Set(['this', 'that', 'with', 'from', 'have', 'were', 'which', 'their', 'about', 'these', 'could']);
    const freqs = {};
    words.forEach(w => {
      if (!stopWords.has(w)) {
        freqs[w] = (freqs[w] || 0) + 1;
      }
    });
    return Object.entries(freqs)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(entry => entry[0]);
  }
}

export const documentProcessor = new DocumentProcessor();
