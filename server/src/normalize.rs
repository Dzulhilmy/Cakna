/// Exact port of the sample's `normAr` (index.html L1534):
/// strip ً-ٟ, ٰ, ۖ-ۭ, ـ (tatweel);
/// fold alef variants to bare alef, ى→ي, ؤ→و, ئ→ي.
/// The corpus contains no surrogate pairs, so char-wise processing matches
/// the JS UTF-16 semantics exactly.
pub fn norm_ar(t: &str) -> String {
    t.chars()
        .filter_map(|c| match c {
            '\u{064B}'..='\u{065F}' | '\u{0670}' | '\u{06D6}'..='\u{06ED}' | '\u{0640}' => None,
            'أ' | 'إ' | 'آ' | 'ٱ' => Some('ا'),
            'ى' => Some('ي'),
            'ؤ' => Some('و'),
            'ئ' => Some('ي'),
            c => Some(c),
        })
        .collect()
}

pub fn has_arabic(t: &str) -> bool {
    t.chars().any(|c| ('\u{0600}'..='\u{06FF}').contains(&c))
}

/// Escape LIKE wildcards so user input is matched literally (ESCAPE '\').
pub fn escape_like(t: &str) -> String {
    t.replace('\\', "\\\\").replace('%', "\\%").replace('_', "\\_")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn strips_harakat() {
        assert_eq!(norm_ar("بِسْمِ"), "بسم");
        assert_eq!(norm_ar("ٱللَّهِ"), "الله");
        assert_eq!(norm_ar("الْحَمْدُ"), "الحمد");
    }

    #[test]
    fn folds_letters() {
        assert_eq!(norm_ar("أإآٱ"), "اااا");
        assert_eq!(norm_ar("مُوسَىٰ"), "موسي");
        assert_eq!(norm_ar("يُؤْمِنُونَ"), "يومنون");
    }

    #[test]
    fn keeps_taa_marbuta_and_hamza() {
        assert_eq!(norm_ar("رَحْمَة"), "رحمة");
        assert_eq!(norm_ar("ماء"), "ماء");
    }

    #[test]
    fn arabic_detection() {
        assert!(has_arabic("سلام"));
        assert!(!has_arabic("salam"));
    }

    #[test]
    fn like_escaping() {
        assert_eq!(escape_like("a%b_c\\d"), "a\\%b\\_c\\\\d");
    }
}
