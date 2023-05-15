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
        //score -= 0.5;
        foundErrors = true;
        console.log(`Encontrado erro de tamanho de parágrafo`);
      }
  
      const sentences = paragraphs[i].match(/[^.!?:]+[.!?:]+/g);
      if (sentences) {
        for (let j = 0; j < sentences.length; j++) {
          const words = sentences[j].split(/\s+/);
          if (words.length >= 3) {
            if (words[0].endsWith("o") || words[0].endsWith("a") || words[0].endsWith("os") || words[0].endsWith("as")) {
              if (words[1].match(/^[a-záéíóúãẽĩõũâêîôûàèìòùç]+$/i) && words[2].match(/^[a-záéíóúãẽĩõũâêîôûàèìòùç]+$/i)) {
                score -= 1;
                foundErrors = true;
                console.log(`Encontrado erro de ordem sujeito verbo predicado`);
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
    const personalSpeechRegex = new RegExp(`\\b(${personalPronouns.join("|")})\\b`, "i");
    if (personalSpeechRegex.test(this.text)) {
      score -= 0.5;
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
      if (maxCount > 7) {
        score -= 0.5;
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
      let highlightedText = "";
      highlightedText += `
      <details>
        <summary><strong>Evite usar forma pessoal de falar!</strong></summary>
    `;
      const personalPronouns = ["eu", "meu", "minha", "meus", "minhas"];
      const personalSpeechRegex = new RegExp(`\\b(${personalPronouns.join("|")})\\b`, "ig");
      const paragraphs = this.text.split(/\n+/);
    
      for (let i = 0; i < paragraphs.length; i++) {
        const sentences = paragraphs[i].match(/[^.!?:]+[.!?:]+/g);
        let paragraphText = "";
    
        if (sentences) {
          for (let j = 0; j < sentences.length; j++) {
            const highlightedSentence = sentences[j].replace(personalSpeechRegex, (match) => {
              return `<span class="error error-personal-speech">${match}</span>`;
            });
    
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
    let highlightedText = "";
    highlightedText += `
      <details>
        <summary><strong>Erro de ordem de sujeito, verbo e predicado!</strong></summary>
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
            if (words[0].endsWith("o") || words[0].endsWith("a") || words[0].endsWith("os") || words[0].endsWith("as")) {
              if (words[1].match(/^[a-záéíóúãẽĩõũâêîôûàèìòùç]+$/i) && words[2].match(/^[a-záéíóúãẽĩõũâêîôûàèìòùç]+$/i)) {
                highlightedText += `<span class="error error-subject-verb-predicate">${sentences[j]}</span>`;
                continue;
              }
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
        <summary><strong>Excesso de repetição de palavra por paragrafo!</strong></summary>
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
            if (countWord > 7) {
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

  getHighlightedTextParagraphLength() {
    let highlightedText = "";
    highlightedText += `
    <details>
      <summary><strong>Paragrafo deve ter de 7 a 10 linhas!</strong></summary>
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
