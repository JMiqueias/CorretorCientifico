class TextProcessor {
  constructor(text) {
    this.text = text;
  }

  getScore() {
    let score = 100;
    let foundErrors = false;
    const paragraphs = this.text.split(/\n+/);
  
    for (let i = 0; i < paragraphs.length; i++) {
      const paragraphLength = paragraphs[i].length;
      if (paragraphLength < 580 || paragraphLength > 840) {
        foundErrors = true;
        score -= 1;
        console.log(`Encontrado erro de tamanho de parágrafo`);
      }
  
      const sentences = paragraphs[i].match(/[^.!?:]+[.!?:]+/g);
      if (sentences) {
        for (let j = 0; j < sentences.length; j++) {
          const words = sentences[j].split(/\s+/);
          if (words.length >= 3) {
            const subject = words[0];
            const verb = words[1];
            const predicate = words.slice(2).join(' ');
  
            const subjectRegex = /^(o|a|os|as)$/i;
            const verbRegex = /^[a-záéíóúãẽĩõũâêîôûàèìòùç]+$/i;
  
            if (
              (subjectRegex.test(subject.toLowerCase()) && verbRegex.test(verb.toLowerCase())) ||
              (/^eu$/i.test(subject) && !verbRegex.test(verb.toLowerCase())) ||
              (/^(acredito|penso|acho)$/i.test(subject.toLowerCase()) && verb.toLowerCase() === 'que')
            ) {
              score -= 1;
              foundErrors = true;
              console.log(`Encontrado erro de ordem sujeito verbo predicado`);
            }
  
            if (!/,/.test(sentences[j]) && words.length >= 5) {
              const commaIndex = words.findIndex(word => word.endsWith(','));
              if (commaIndex === -1 || commaIndex !== words.length - 2) {
                score -= 1;
                foundErrors = true;
                console.log(`Encontrado erro de uso de vírgula`);
              }
            }
  
            if (subjectRegex.test(subject.toLowerCase()) && verb.toLowerCase() === 'estar') {
              const subjectIndex = words.findIndex(word => subjectRegex.test(word.toLowerCase()));
              const verbIndex = words.findIndex(word => verb.toLowerCase() === word.toLowerCase());
              if (verbIndex - subjectIndex > 2) {
                score -= 1;
                foundErrors = true;
                console.log(`Encontrado erro de proximidade entre sujeito e verbo`);
              }
            }
          }
        }
      }
    }
  
    const periods = this.text.match(/[^.!?:]+[.!?:]+/g);
    for (let i = 0; i < periods.length; i++) {
      if (periods[i].length > 280) {
        score -= 1;
        foundErrors = true;
        console.log(`Encontrado erro de tamanho de período`);
      }
    }
  
    const personalPronouns = ["eu", "meu", "minha", "meus", "minhas"];
    const personalSpeechRegex = new RegExp(`\\b(${personalPronouns.join("|")}|acredito|penso|acho)\\b`, "i");
    if (personalSpeechRegex.test(this.text)) {
      score -= 1;
      foundErrors = true;
      console.log(`Encontrada fala pessoal`);
    }
  
    const wordsPerParagraph = paragraphs.map(paragraph => paragraph.replace(/[^\w\s]/g, "").split(/\s+/));
    const repeatedWordsPerParagraph = wordsPerParagraph.map(words => {
      const count = {};
      words.forEach(word => count[word] = (count[word] || 0) + 1);
      return count;
    });
    for (let i = 0; i < repeatedWordsPerParagraph.length; i++) {
      const maxCount = Math.max(...Object.values(repeatedWordsPerParagraph[i]));
      if (maxCount > 5) {
        score -= 1;
        foundErrors = true;
        console.log(`Encontrada palavra repetida ${maxCount} vezes em um parágrafo`);
      }
    }
  
    if (!foundErrors) {
      console.log("Não foram encontrados erros.");
    }
  
    return score;
  }
  
  

  getHighlightedTextLongPeriods() {
    let highlightedText = "";
    highlightedText += `
      <details>
        <summary><strong>Periodo longo!</strong></summary>
    `;
    const paragraphs = this.text.split(/\n+/);

    for (let i = 0; i < paragraphs.length; i++) {
      const sentences = paragraphs[i].match(/[^.!?:]+[.!?:]+/g);
      const paragraphLength = paragraphs[i].length;

      if (sentences) {
        highlightedText += "<p>";
        for (let j = 0; j < sentences.length; j++) {
          if (sentences[j].length > 280) {
            highlightedText += `<span class="error error-length">${sentences[j]}</span>`;
          } else {
            highlightedText += sentences[j];
          }
        }

        highlightedText += "</p>";
      } else {
        highlightedText += "<p>" + paragraphs[i] + "</p>";
      }
    }

    highlightedText += `
      </details>
    `;

    return `<div style="text-align: justify">${highlightedText}</div>`;
  }    

  getHighlightedTextPersonalSpeech() {
    let highlightedText = `
      <details>
        <summary><strong>Evite usar a forma pessoal de falar!</strong></summary>
    `;
    const personalPronouns = ["eu", "meu", "minha", "meus", "minhas"];
    const personalSpeechRegex = new RegExp(`\\b(${personalPronouns.join("|")}|acredito|penso|acho)\\b`, "gi");
    const paragraphs = this.text.split(/\n+/);
  
    for (let i = 0; i < paragraphs.length; i++) {
      const sentences = paragraphs[i].match(/[^.!?:]+[.!?:]+/g);
      let paragraphText = "";
  
      if (sentences) {
        for (let j = 0; j < sentences.length; j++) {
          const sentence = sentences[j];
          let highlightedSentence = sentence.replace(personalSpeechRegex, '<span class="error error-personal-speech">$&</span>');
          paragraphText += highlightedSentence;
        }
      } else {
        paragraphText = paragraphs[i];
      }
  
      highlightedText += `<p>${paragraphText}</p>`;
    }
  
    highlightedText += `
      </details>
    `;
  
    return `<div style="text-align: justify">${highlightedText}</div>`;
  }
  
  
  
      
  getHighlightedTextSubjectVerbPredicateErrors() {
    let highlightedText = `
      <details>
        <summary><strong>Os períodos devem seguir a sequência de sujeito, verbo e predicado!</strong></summary>
    `;
    const paragraphs = this.text.split(/\n+/);
  
    for (let i = 0; i < paragraphs.length; i++) {
      const sentences = paragraphs[i].match(/[^.!?:]+[.!?:]+/g);
      const paragraphLength = paragraphs[i].length;
  
      if (sentences) {
        highlightedText += "<p>";
        for (let j = 0; j < sentences.length; j++) {
          const words = sentences[j].split(/\s+/);
          if (words.length >= 3) {
            const subject = words[0];
            const verb = words[1];
            const predicate = words.slice(2).join(" ");
            const subjectRegex = /^(o|a|os|as)$/i;
            const verbRegex = /^[a-záéíóúãẽĩõũâêîôûàèìòùç]+$/i;
  
            if (!subjectRegex.test(subject.toLowerCase()) || !verbRegex.test(verb.toLowerCase())) {
              highlightedText += `<span class="error error-subject-verb-predicate">${sentences[j]}</span>`;
              continue;
            }
          }
          highlightedText += sentences[j];
        }
  
        highlightedText += "</p>";
      } else {
        highlightedText += "<p>" + paragraphs[i] + "</p>";
      }
    }
  
    highlightedText += `
      </details>
    `;
  
    return `<div style="text-align: justify">${highlightedText}</div>`;
  }
  
  
  getHighlightedTextRepeatedWords() {
    let highlightedText = "";
    highlightedText += `
      <details>
        <summary><strong>Evite o excesso de repetição de palavras!</strong></summary>
    `;
    const paragraphs = this.text.split(/\n+/);
  
    for (let i = 0; i < paragraphs.length; i++) {
      const words = paragraphs[i].replace(/[^\w\s]/g, "").split(/\s+/).filter(word => !["o", "a", "os", "as", "um", "uma", "uns", "umas"].includes(word));
      const count = {};
      words.forEach(word => count[word] = (count[word] || 0) + 1);
    
      let highlightedParagraph = "";
    
      const sentences = paragraphs[i].match(/[^.!?:]+[.!?:]+/g);
      if (sentences) {
        highlightedParagraph += "<p>";
        for (let j = 0; j < sentences.length; j++) {
          let highlightedSentence = "";
    
          const originalSentence = sentences[j];
          const sentenceWords = originalSentence.replace(/[^\w\s]/g, "").split(/\s+/).filter(word => !["o", "a", "os", "as", "um", "uma", "uns", "umas"].includes(word));
          for (let k = 0; k < sentenceWords.length; k++) {
            const word = sentenceWords[k];
            const countWord = count[word];
            if (countWord > 5) {
              const regex = new RegExp(`\\b${word}\\b`, "g");
              const replaceValue = `<span class="error error-repeated-words">${word}</span>`;
              highlightedSentence = originalSentence.replace(regex, replaceValue);
            }
          }
          if (!highlightedSentence) {
            highlightedSentence = originalSentence;
          }
    
          highlightedParagraph += highlightedSentence;
        }
    
        highlightedParagraph += "</p>";
      } else {
        highlightedParagraph += "<p>" + paragraphs[i] + "</p>";
      }
    
      highlightedText += highlightedParagraph;
    }
    
    highlightedText += `
      </details>
    `;
    
    return `<div style="text-align: justify">${highlightedText}</div>`;
  }

  getHighlightedTextCommaErrors() {
    let highlightedText = `
      <details>
        <summary><strong>Utilização errada da vírgula!</strong></summary>
    `;
    const paragraphs = this.text.split(/\n+/);
  
    for (let i = 0; i < paragraphs.length; i++) {
      const sentences = paragraphs[i].match(/[^.!?:]+[.!?:]+/g);
      let paragraphText = "";
  
      if (sentences) {
        for (let j = 0; j < sentences.length; j++) {
          const words = sentences[j].split(/\s+/);
          let highlightedSentence = sentences[j];
  
          if (!/,/.test(sentences[j]) && words.length >= 5) {
            const commaIndex = words.findIndex(word => word.endsWith(','));
            if (commaIndex === -1 || commaIndex !== words.length - 2) {
              highlightedSentence = `<span class="error error-comma">${highlightedSentence}</span>`;
            }
          }
  
          paragraphText += highlightedSentence;
        }
      } else {
        paragraphText = paragraphs[i];
      }
  
      highlightedText += `<p>${paragraphText}</p>`;
    }
  
    highlightedText += `
      </details>
    `;
  
    return `<div style="text-align: justify">${highlightedText}</div>`;
  }
  
  getHighlightedTextSubjectVerbProximityErrors() {
    let highlightedText = `
      <details>
        <summary><strong>O verbo deve se manter proximo do sujeito!</strong></summary>
    `;
    const paragraphs = this.text.split(/\n+/);
  
    for (let i = 0; i < paragraphs.length; i++) {
      const sentences = paragraphs[i].match(/[^.!?:]+[.!?:]+/g);
      let paragraphText = "";
  
      if (sentences) {
        for (let j = 0; j < sentences.length; j++) {
          const words = sentences[j].split(/\s+/);
          const subjectRegex = /^(o|a|os|as)$/i;
          const verb = words[1];
  
          if (subjectRegex.test(words[0].toLowerCase()) && verb.toLowerCase() === 'estar') {
            const subjectIndex = words.findIndex(word => subjectRegex.test(word.toLowerCase()));
            const verbIndex = words.findIndex(word => verb.toLowerCase() === word.toLowerCase());
            if (verbIndex - subjectIndex > 2) {
              paragraphText += `<span class="error error-subject-verb-proximity">${sentences[j]}</span>`;
              continue;
            }
          }
  
          paragraphText += sentences[j];
        }
      } else {
        paragraphText = paragraphs[i];
      }
  
      highlightedText += `<p>${paragraphText}</p>`;
    }
  
    highlightedText += `
      </details>
    `;
  
    return `<div style="text-align: justify">${highlightedText}</div>`;
  }

  getHighlightedTextParagraphLength() {
    let highlightedText = "";
    highlightedText += `
    <details>
      <summary><strong><span class="warning">Warning!</span> Padronize o tamanho dos paragrafos! (Paragrafos de 7 a 10 linhas)</strong></summary>
  `;
    const paragraphs = this.text.split(/\n+/);

    for (let i = 0; i < paragraphs.length; i++) {
      const sentences = paragraphs[i].match(/[^.!?:]+[.!?:]+/g);
      const paragraphLength = paragraphs[i].length;
    
      if (paragraphLength < 580 || paragraphLength > 840) {
        highlightedText += `<p><span class="error error-paragraph">${paragraphs[i]}</span></p>`;
      } else {
        highlightedText += "<p>" + paragraphs[i] + "</p>";
      }
    }

    highlightedText += `
    </details>
  `;
    
    return `<div style="text-align: justify">${highlightedText}</div>`;
  }
  
}
