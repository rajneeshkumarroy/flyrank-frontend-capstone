# AI-Assisted Workflow Comparison

## Overview

In this assignment, I implemented the same React Settings Form using two different AI prompting approaches to compare their effectiveness.

### Round 1 – Vague Prompt

For the first implementation, I used the prompt:

> "Create a React settings form."

The AI generated a functional settings form with a clean interface. It included basic form fields and styling, but the implementation lacked detailed validation and some accessibility improvements. It required additional review to understand whether important edge cases such as password confirmation, invalid email formats, and empty required fields were handled correctly. The code was generated quickly, but I still needed to inspect it carefully before accepting it.

### Round 2 – Detailed Prompt

For the second implementation, I used a much more detailed prompt that specified the required fields, validation rules, accessibility requirements, responsive design, project structure, verification steps, and expected behavior.

The generated result was significantly more complete. Validation logic was implemented correctly, labels were associated with form fields, responsive styling was improved, and the overall structure of the component was cleaner and easier to understand. Because the prompt included verification instructions, the AI also explained how the validation worked and described how the application could be tested.

## Comparison

The detailed prompt produced higher-quality code with fewer issues to review. It handled edge cases such as password mismatch and invalid email input more effectively than the vague prompt. Accessibility was also improved through proper labels and clearer form structure.

The vague prompt was faster to write, but it required more manual inspection and verification afterward. Although the detailed prompt took longer to prepare, it reduced the overall review effort and produced a more reliable implementation.

## AI Mistake Identified

During the first implementation, the AI focused mainly on creating the user interface and did not include all of the validation and accessibility requirements that would be expected in a production-quality form. This highlighted the importance of providing precise instructions rather than relying on a generic request.

## Conclusion

This exercise demonstrated that prompt quality has a direct impact on code quality. A detailed prompt with clear constraints, expected behavior, and verification steps produces more maintainable, accessible, and reliable code while reducing the amount of manual review required.