POST
{{localBaseUrl}}/service/comic/init
body:
{
  "prompt": "Buatkan saya cerita komik tentang samurai yang sedang menjaga kastil",
  "num_scenes": 2,
  "num_characters": 2,
  "with_dialog": true,
  "language": "english"
}
response:
{
    "comic_id": 2,
    "status": "draft",
    "story_suggestions": [
        {
            "title": "The Late-Night Study Session",
            "summary": "Maya, a diligent student, attempts to guide her easily distracted friend Leo through a late-night study session for a crucial exam. Despite Leo's playful antics and constant need for breaks, they manage to cover significant ground, ending their night exhausted but with a sense of accomplishment.",
            "scenes": [
                {
                    "scene_num": 1,
                    "description": "Late evening. Maya's meticulously organized study desk is bathed in the soft glow of a desk lamp. Textbooks, neatly stacked, surround them. Maya, focused and calm, points at a diagram in a book. Leo, sprawled casually in his chair, stifles a yawn, his gaze drifting towards a window showing the dark night. Empty snack wrappers are scattered near him.",
                    "dialogs": [
                        {
                            "type": "character",
                            "character_num": 1,
                            "character_name": "Maya",
                            "character_desc": "Female, 16, petite, wears round glasses, neat ponytail. Dressed in a simple, light-colored sweater.",
                            "text": "Okay, so remember the main principle here...",
                            "bubble_coord": null
                        },
                        {
                            "type": "character",
                            "character_num": 2,
                            "character_name": "Leo",
                            "character_desc": "Male, 16, lanky, messy brown hair, expressive eyes. Wears a loose hoodie and sweatpants.",
                            "text": "Can we take a five-minute break? My brain cells are protesting!",
                            "bubble_coord": null
                        }
                    ]
                },
                {
                    "scene_num": 2,
                    "description": "Early morning light filters through the same window, a subtle change in hue from the previous scene. Maya and Leo are still at the desk, looking significantly more tired, but a pile of completed notes sits between them. Maya leans back, a small, satisfied smile on her face. Leo stretches dramatically, rubbing his eyes, but his posture shows a hint of relief.",
                    "dialogs": [
                        {
                            "type": "character",
                            "character_num": 1,
                            "character_name": "Maya",
                            "character_desc": "Female, 16, petite, wears round glasses, neat ponytail. Dressed in a simple, light-colored sweater.",
                            "text": "See? We actually made it through!",
                            "bubble_coord": null
                        },
                        {
                            "type": "character",
                            "character_num": 2,
                            "character_name": "Leo",
                            "character_desc": "Male, 16, lanky, messy brown hair, expressive eyes. Wears a loose hoodie and sweatpants.",
                            "text": "My brain feels like mush, but... I think I actually learned something!",
                            "bubble_coord": null
                        },
                        {
                            "type": "narration",
                            "character_num": null,
                            "character_name": null,
                            "character_desc": null,
                            "text": "The quiet hum of dawn promised a new day, and a well-earned rest.",
                            "bubble_coord": null
                        }
                    ]
                }
            ]
        },
        {
            "title": "The Mysterious Old Book",
            "summary": "Chloe, a curious and observant student, stumbles upon an ancient, peculiar book in the dusty corners of the school library. Intrigued by its strange symbols, she enlists the help of her more pragmatic friend, Sam, to decipher its mysteries, hoping to uncover a hidden secret within the school's history.",
            "scenes": [
                {
                    "scene_num": 1,
                    "description": "A quiet, late afternoon in the old section of the school library. Sunlight streams through a tall window, illuminating dust motes dancing in the air. Chloe, with a look of intense fascination, carefully pulls a worn, leather-bound book from a high, forgotten shelf. Sam, standing nearby, leans against a bookshelf with arms crossed, a slightly skeptical but amused expression on his face.",
                    "dialogs": [
                        {
                            "type": "character",
                            "character_num": 1,
                            "character_name": "Chloe",
                            "character_desc": "Female, 15, slender build, long wavy auburn hair, thoughtful green eyes, usually wears a vintage cardigan over a simple dress.",
                            "text": "Look at this! It's not like any book I've ever seen.",
                            "bubble_coord": null
                        },
                        {
                            "type": "character",
                            "character_num": 2,
                            "character_name": "Sam",
                            "character_desc": "Male, 15, average build, short dark hair, expressive brown eyes, dressed in a faded graphic t-shirt and jeans with a backpack slung over one shoulder.",
                            "text": "Probably just some old yearbook, Chloe. Don't get your hopes up.",
                            "bubble_coord": null
                        }
                    ]
                },
                {
                    "scene_num": 2,
                    "description": "Later that evening, the science classroom is dimly lit, with a single projector shining a page from the mysterious book onto the whiteboard. The page is filled with intricate, non-alphabetic symbols. Chloe and Sam lean in closely, eyes wide with a mixture of confusion and excitement. Chloe is holding a small notepad, jotting down observations, while Sam points to a specific symbol on the projection, a look of dawning realization on his face.",
                    "dialogs": [
                        {
                            "type": "character",
                            "character_num": 1,
                            "character_name": "Chloe",
                            "character_desc": "Female, 15, slender build, long wavy auburn hair, thoughtful green eyes, usually wears a vintage cardigan over a simple dress.",
                            "text": "These aren't just doodles... they have to mean something!",
                            "bubble_coord": null
                        },
                        {
                            "type": "character",
                            "character_num": 2,
                            "character_name": "Sam",
                            "character_desc": "Male, 15, average build, short dark hair, expressive brown eyes, dressed in a faded graphic t-shirt and jeans with a backpack slung over one shoulder.",
                            "text": "Wait a second... that symbol... it's similar to the old crest on the school bell tower!",
                            "bubble_coord": null
                        }
                    ]
                }
            ]
        },
        {
            "title": "Group Project Panic",
            "summary": "Ava, a meticulous and often anxious student, finds herself overwhelmed by a looming group project deadline, while her creative but laid-back partner, Ben, struggles to match her urgency. Their contrasting approaches lead to initial friction, but they ultimately find a way to collaborate effectively, making significant progress as the night wears on.",
            "scenes": [
                {
                    "scene_num": 1,
                    "description": "Ava's living room, late afternoon. The coffee table is buried under a landslide of textbooks, loose papers, and half-eaten snacks. Ava sits rigidly, a worried frown creasing her brow, furiously typing on a laptop. Ben, sprawled on a beanbag chair, casually sketches in a notebook, occasionally glancing at Ava with a relaxed, almost indifferent expression. The atmosphere is tense with Ava's stress.",
                    "dialogs": [
                        {
                            "type": "character",
                            "character_num": 1,
                            "character_name": "Ava",
                            "character_desc": "Female, 17, average height, neat shoulder-length brown hair, expressive grey eyes. Wears a crisp blouse and jeans, always looks slightly worried.",
                            "text": "Ben, we only have until tomorrow! We're nowhere near finished!",
                            "bubble_coord": null
                        },
                        {
                            "type": "character",
                            "character_num": 2,
                            "character_name": "Ben",
                            "character_desc": "Male, 17, tall and lean, shaggy blond hair often falling into his eyes, a permanent easygoing smile. Dressed in an oversized band t-shirt and cargo shorts.",
                            "text": "Relax, Ava. Inspiration strikes when it's ready. Besides, pressure makes diamonds!",
                            "bubble_coord": null
                        }
                    ]
                },
                {
                    "scene_num": 2,
                    "description": "Hours later, the living room is still a bit messy, but the energy has shifted. It's late evening now, with the room illuminated by floor lamps. Ava and Ben are sitting side-by-side at the coffee table, a large poster board spread between them, covered with colorful notes and diagrams. Ava is smiling faintly, gesturing enthusiastically, while Ben, now more engaged, holds a marker, adding details with a focused expression. Empty coffee mugs stand nearby.",
                    "dialogs": [
                        {
                            "type": "character",
                            "character_num": 1,
                            "character_name": "Ava",
                            "character_desc": "Female, 17, average height, neat shoulder-length brown hair, expressive grey eyes. Wears a crisp blouse and jeans, always looks slightly worried.",
                            "text": "That's brilliant, Ben! The visual elements really tie it all together.",
                            "bubble_coord": null
                        },
                        {
                            "type": "character",
                            "character_num": 2,
                            "character_name": "Ben",
                            "character_desc": "Male, 17, tall and lean, shaggy blond hair often falling into his eyes, a permanent easygoing smile. Dressed in an oversized band t-shirt and cargo shorts.",
                            "text": "See? Told you we'd get there. My brain just needed a warm-up!",
                            "bubble_coord": null
                        },
                        {
                            "type": "narration",
                            "character_num": null,
                            "character_name": null,
                            "character_desc": null,
                            "text": "Despite their differences, their combined efforts began to shape a truly impressive project.",
                            "bubble_coord": null
                        }
                    ]
                }
            ]
        }
    ]
}

PUT
{{localBaseUrl}}/service/comic/1/select-story
body:
{
    "chosen_story": {
        "title": "The Late-Night Study Session",
        "summary": "Maya, a diligent student, attempts to guide her easily distracted friend Leo through a late-night study session for a crucial exam. Despite Leo's playful antics and constant need for breaks, they manage to cover significant ground, ending their night exhausted but with a sense of accomplishment.",
        "scenes": [
            {
                "scene_num": 1,
                "description": "Late evening. Maya's meticulously organized study desk is bathed in the soft glow of a desk lamp. Textbooks, neatly stacked, surround them. Maya, focused and calm, points at a diagram in a book. Leo, sprawled casually in his chair, stifles a yawn, his gaze drifting towards a window showing the dark night. Empty snack wrappers are scattered near him.",
                "dialogs": [
                    {
                        "type": "character",
                        "character_num": 1,
                        "character_name": "Maya",
                        "character_desc": "Female, 16, petite, wears round glasses, neat ponytail. Dressed in a simple, light-colored sweater.",
                        "text": "Okay, so remember the main principle here...",
                        "bubble_coord": null
                    },
                    {
                        "type": "character",
                        "character_num": 2,
                        "character_name": "Leo",
                        "character_desc": "Male, 16, lanky, messy brown hair, expressive eyes. Wears a loose hoodie and sweatpants.",
                        "text": "Can we take a five-minute break? My brain cells are protesting!",
                        "bubble_coord": null
                    }
                ]
            },
            {
                "scene_num": 2,
                "description": "Early morning light filters through the same window, a subtle change in hue from the previous scene. Maya and Leo are still at the desk, looking significantly more tired, but a pile of completed notes sits between them. Maya leans back, a small, satisfied smile on her face. Leo stretches dramatically, rubbing his eyes, but his posture shows a hint of relief.",
                "dialogs": [
                    {
                        "type": "character",
                        "character_num": 1,
                        "character_name": "Maya",
                        "character_desc": "Female, 16, petite, wears round glasses, neat ponytail. Dressed in a simple, light-colored sweater.",
                        "text": "See? We actually made it through!",
                        "bubble_coord": null
                    },
                    {
                        "type": "character",
                        "character_num": 2,
                        "character_name": "Leo",
                        "character_desc": "Male, 16, lanky, messy brown hair, expressive eyes. Wears a loose hoodie and sweatpants.",
                        "text": "My brain feels like mush, but... I think I actually learned something!",
                        "bubble_coord": null
                    },
                    {
                        "type": "narration",
                        "character_num": null,
                        "character_name": null,
                        "character_desc": null,
                        "text": "The quiet hum of dawn promised a new day, and a well-earned rest.",
                        "bubble_coord": null
                    }
                ]
            }
        ]
    },
    "image_references": [
        {
            "character_num": 1,
            "character_name": "Maya",
            "image_url": "http://localhost:9000/comic/1/references/9fc42a9e-0d93-4c98-85e8-79a2fc95c41b_smiley-woman-holding-stack-books.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20251016%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251016T223244Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=502a5fcb4697a6e93032808c14a742d3fd6897536776491892f9d507b0b993ef"
        },
        {
            "character_num": 2,
            "character_name": "Leo",
            "image_url": "http://localhost:9000/comic/1/references/1eb1c325-cf18-443b-afe9-15ecd7931af5_ad3bf027-e85b-4cad-ab5f-80a25e37f4cb.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20251016%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251016T223244Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=e7282155c4981fa43f8dd3fedbb5a6d6dcc25083e92fd6997b8c8d0530793066"
        }
    ],
    "grid_cols": 1,
    "orientation": "horizontal",
    "ratio": "1:1",
    "style": "manga",
    "model_type": "google_imagen"
}

response;
{
    "comic_id": 1,
    "status": "images_generated",
    "generated_images": [
        "http://localhost:9000/comic/1/generated/4f5d9889-8975-4f5f-af42-7e6c5d715919.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20251016%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251016T225402Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=ad9875769256b8f55c50803a29b21ecf826edc37815fbc9343ec0911c6524b68",
        "http://localhost:9000/comic/1/generated/e0fd0748-1e3e-4f79-b2e9-397e036a13bc.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20251016%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251016T225407Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=7905b1b554fedeb0180e881c36ca922293a73900f03b377ec196c86f59f65a13"
    ],
    "image_references": [
        {
            "character_num": 1,
            "character_name": "Maya",
            "image_url": "http://localhost:9000/comic/1/references/9fc42a9e-0d93-4c98-85e8-79a2fc95c41b_smiley-woman-holding-stack-books.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20251016%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251016T223244Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=502a5fcb4697a6e93032808c14a742d3fd6897536776491892f9d507b0b993ef",
            "llm_description": "A smiling young East Asian woman, likely in her early twenties, is depicted from the waist up against a plain light blue background. She has long, straight dark hair parted near the center, flowing over her shoulders. Her oval face features clear skin, a wide genuine smile revealing even white teeth, and dark eyes behind round, silver-rimmed glasses.\n\nShe is dressed in a short-sleeved knit top with horizontal black and white stripes, featuring wider white stripes on the torso and black stripes on the sleeves. This is paired with high-waisted dark blue denim jeans, visible from the waist down, featuring copper-toned buttons and rivets.\n\nHer arms are crossed at her midsection, holding two notebooks/folders: a plain bright pink one in front, and a smaller pink and white grid-patterned one behind it. A light beige pencil is also held in her right hand, tucked in with the notebooks. Her pose is friendly and confident, facing directly forward with a bright, welcoming expression."
        },
        {
            "character_num": 2,
            "character_name": "Leo",
            "image_url": "http://localhost:9000/comic/1/references/1eb1c325-cf18-443b-afe9-15ecd7931af5_ad3bf027-e85b-4cad-ab5f-80a25e37f4cb.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20251016%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251016T223244Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=e7282155c4981fa43f8dd3fedbb5a6d6dcc25083e92fd6997b8c8d0530793066",
            "llm_description": "This is a vector illustration of a young male character, presented as a bust shot against a plain white background.\n\n**Appearance:**\n*   **Skin Tone:** He has a light-to-medium, warm skin tone.\n*   **Hair:** His hair is short, dark brown or black, and styled with a slightly tousled, voluminous look on top, sweeping a little forward on his forehead. The sides are shorter, just covering the upper parts of his ears.\n*   **Eyes:** He has large, dark brown eyes with visible white sclera and small white highlights, suggesting a friendly gaze.\n*   **Eyebrows:** His eyebrows are thin, dark, and gently arched, positioned just above his glasses.\n*   **Nose:** He has a small, simple nose.\n*   **Mouth & Expression:** He wears a wide, open-mouthed smile, revealing a row of white upper teeth and a hint of a pink tongue. His cheeks are slightly raised with the smile.\n*   **Ears:** His ears are visible, simple in shape, and partially covered by his hair and glasses.\n*   **Distinctive Features:** The most prominent feature is his thick-rimmed, black, round-framed glasses, which sit on the bridge of his nose and frame his eyes.\n\n**Clothing:**\n*   He is wearing a dark forest green (or teal green) hoodie. The hoodie appears to be unzipped, revealing a bright, solid orange crew-neck t-shirt underneath.\n*   Two white drawstrings with white tips hang down from the hood opening of the green hoodie.\n\n**Pose:**\n*   He is depicted in a direct, frontal pose, looking straight ahead with a friendly and inviting expression. His head is held upright, and his shoulders are slightly visible."
        }
    ]
}

PUT
{{localBaseUrl}}/service/comic/1/finalize
body:
{
    "image_order": [
        "http://localhost:9000/comic/1/generated/ac32c34d-cdb3-4a8c-a15a-75cdff0a1a3a.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20251018%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251018T193027Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=03b8cddbcb7e8bbac8233a10e918173ec6401293d790e021907794ceac82fbc7",
        "http://localhost:9000/comic/1/generated/477463da-1d3f-4b82-9d23-2480ac4f1011.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20251018%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251018T193032Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=d91783242cc231c800be3dec69801f2779b2893ff8a7b8fa94dc9ea0c0a22a2e"
    ],
    "updated_story": {
        "title": "The Late-Night Study Session",
        "summary": "Maya, a diligent student, attempts to guide her easily distracted friend Leo through a late-night study session for a crucial exam. Despite Leo's playful antics and constant need for breaks, they manage to cover significant ground, ending their night exhausted but with a sense of accomplishment.",
        "scenes": [
            {
                "scene_num": 1,
                "description": "Late evening. Maya's meticulously organized study desk is bathed in the soft glow of a desk lamp. Textbooks, neatly stacked, surround them. Maya, focused and calm, points at a diagram in a book. Leo, sprawled casually in his chair, stifles a yawn, his gaze drifting towards a window showing the dark night. Empty snack wrappers are scattered near him.",
                "dialogs": [
                    {
                        "type": "character",
                        "character_num": 1,
                        "character_name": "Maya",
                        "character_desc": "A smiling young East Asian woman, likely in her early twenties, is depicted from the waist up against a plain light blue background. She has long, straight dark hair parted near the center, flowing over her shoulders. Her oval face features clear skin, a wide genuine smile revealing even white teeth, and dark eyes behind round, silver-rimmed glasses.\n\nShe is dressed in a short-sleeved knit top with horizontal black and white stripes, featuring wider white stripes on the torso and black stripes on the sleeves. This is paired with high-waisted dark blue denim jeans, visible from the waist down, featuring copper-toned buttons and rivets.\n\nHer arms are crossed at her midsection, holding two notebooks/folders: a plain bright pink one in front, and a smaller pink and white grid-patterned one behind it. A light beige pencil is also held in her right hand, tucked in with the notebooks. Her pose is friendly and confident, facing directly forward with a bright, welcoming expression.",
                        "text": "Okay, so remember the main principle here...",
                        "bubble_coord": {
                            "x": 150,
                            "y": 250,
                            "width": 200,
                            "height": 80
                        }
                    },
                    {
                        "type": "character",
                        "character_num": 2,
                        "character_name": "Leo",
                        "character_desc": "This is a vector illustration of a young male character, presented as a bust shot against a plain white background.\n\nAppearance:\n*   Skin Tone: He has a light-to-medium, warm skin tone.\n*   Hair: His hair is short, dark brown or black, and styled with a slightly tousled, voluminous look on top, sweeping a little forward on his forehead. The sides are shorter, just covering the upper parts of his ears.\n*   Eyes: He has large, dark brown eyes with visible white sclera and small white highlights, suggesting a friendly gaze.\n*   Eyebrows: His eyebrows are thin, dark, and gently arched, positioned just above his glasses.\n*   Nose: He has a small, simple nose.\n*   Mouth & Expression: He wears a wide, open-mouthed smile, revealing a row of white upper teeth and a hint of a pink tongue. His cheeks are slightly raised with the smile.\n*   Ears: His ears are visible, simple in shape, and partially covered by his hair and glasses.\n*   Distinctive Features: The most prominent feature is his thick-rimmed, black, round-framed glasses, which sit on the bridge of his nose and frame his eyes.\n\nClothing:\n*   He is wearing a dark forest green (or teal green) hoodie. The hoodie appears to be unzipped, revealing a bright, solid orange crew-neck t-shirt underneath.\n*   Two white drawstrings with white tips hang down from the hood opening of the green hoodie.\n\nPose:\n*   He is depicted in a direct, frontal pose, looking straight ahead with a friendly and inviting expression. His head is held upright, and his shoulders are slightly visible.",
                        "text": "Can we take a five-minute break? My brain cells are protesting!",
                        "bubble_coord": {
                            "x": 400,
                            "y": 100,
                            "width": 250,
                            "height": 120
                        }
                    }
                ]
            },
            {
                "scene_num": 2,
                "description": "Early morning light filters through the same window, a subtle change in hue from the previous scene. Maya and Leo are still at the desk, looking significantly more tired, but a pile of completed notes sits between them. Maya leans back, a small, satisfied smile on her face. Leo stretches dramatically, rubbing his eyes, but his posture shows a hint of relief.",
                "dialogs": [
                    {
                        "type": "character",
                        "character_num": 1,
                        "character_name": "Maya",
                        "character_desc": "A smiling young East Asian woman, likely in her early twenties, is depicted from the waist up against a plain light blue background. She has long, straight dark hair parted near the center, flowing over her shoulders. Her oval face features clear skin, a wide genuine smile revealing even white teeth, and dark eyes behind round, silver-rimmed glasses.\n\nShe is dressed in a short-sleeved knit top with horizontal black and white stripes, featuring wider white stripes on the torso and black stripes on the sleeves. This is paired with high-waisted dark blue denim jeans, visible from the waist down, featuring copper-toned buttons and rivets.\n\nHer arms are crossed at her midsection, holding two notebooks/folders: a plain bright pink one in front, and a smaller pink and white grid-patterned one behind it. A light beige pencil is also held in her right hand, tucked in with the notebooks. Her pose is friendly and confident, facing directly forward with a bright, welcoming expression.",
                        "text": "See? We actually made it through!",
                        "bubble_coord": {
                            "x": 120,
                            "y": 300,
                            "width": 180,
                            "height": 90
                        }
                    },
                    {
                        "type": "character",
                        "character_num": 2,
                        "character_name": "Leo",
                        "character_desc": "This is a vector illustration of a young male character, presented as a bust shot against a plain white background.\n\nAppearance:\n*   Skin Tone: He has a light-to-medium, warm skin tone.\n*   Hair: His hair is short, dark brown or black, and styled with a slightly tousled, voluminous look on top, sweeping a little forward on his forehead. The sides are shorter, just covering the upper parts of his ears.\n*   Eyes: He has large, dark brown eyes with visible white sclera and small white highlights, suggesting a friendly gaze.\n*   Eyebrows: His eyebrows are thin, dark, and gently arched, positioned just above his glasses.\n*   Nose: He has a small, simple nose.\n*   Mouth & Expression: He wears a wide, open-mouthed smile, revealing a row of white upper teeth and a hint of a pink tongue. His cheeks are slightly raised with the smile.\n*   Ears: His ears are visible, simple in shape, and partially covered by his hair and glasses.\n*   Distinctive Features: The most prominent feature is his thick-rimmed, black, round-framed glasses, which sit on the bridge of his nose and frame his eyes.\n\nClothing:\n*   He is wearing a dark forest green (or teal green) hoodie. The hoodie appears to be unzipped, revealing a bright, solid orange crew-neck t-shirt underneath.\n*   Two white drawstrings with white tips hang down from the hood opening of the green hoodie.\n\nPose:\n*   He is depicted in a direct, frontal pose, looking straight ahead with a friendly and inviting expression. His head is held upright, and his shoulders are slightly visible.",
                        "text": "My brain feels like mush, but... I think I actually learned something!",
                        "bubble_coord": {
                            "x": 350,
                            "y": 150,
                            "width": 220,
                            "height": 110
                        }
                    },
                    {
                        "type": "narration",
                        "character_num": null,
                        "character_name": null,
                        "character_desc": null,
                        "text": "The quiet hum of dawn promised a new day, and a well-earned rest.",
                        "bubble_coord": {
                            "x": 50,
                            "y": 400,
                            "width": 400,
                            "height": 60
                        }
                    }
                ]
            }
        ]
    },
    "output_format": "png"
}
response;
{
    "comic_id": 1,
    "status": "completed",
    "final_comic_url": "http://localhost:9000/comic/1/final/1_final.OutputFormat.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20251018%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251018T140912Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=c97fe83de52c1f5a428b1a54b38a707d768136a94c6e36e962026f0bdd972107"
}

POST
{{localBaseUrl}}/service/comic/upload-references
body berupa file
response;
{
    "files": [
        {
            "filename": "smiley-woman-holding-stack-books.jpg",
            "public_url": "http://localhost:9000/comic/1/references/9fc42a9e-0d93-4c98-85e8-79a2fc95c41b_smiley-woman-holding-stack-books.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20251016%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251016T223244Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=502a5fcb4697a6e93032808c14a742d3fd6897536776491892f9d507b0b993ef"
        },
        {
            "filename": "ad3bf027-e85b-4cad-ab5f-80a25e37f4cb.jpg",
            "public_url": "http://localhost:9000/comic/1/references/1eb1c325-cf18-443b-afe9-15ecd7931af5_ad3bf027-e85b-4cad-ab5f-80a25e37f4cb.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20251016%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251016T223244Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=e7282155c4981fa43f8dd3fedbb5a6d6dcc25083e92fd6997b8c8d0530793066"
        }
    ]
}