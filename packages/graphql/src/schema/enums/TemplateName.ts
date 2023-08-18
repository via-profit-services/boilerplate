import { GraphQLEnumType } from 'graphql';

const TemplateName = new GraphQLEnumType({
  name: 'TemplateName',
  values: {
    TEMPLATE_HOME_PAGE: { value: 'TemplateHomePage' },
    TEMPLATE_SECOND_PAGE: { value: 'TemplateSecondPage' },
    TEMPLATE_FALLBACK_PAGE: { value: 'TemplateFallbackPage' },

    TEMPLATE_BLOG_PAGE: { value: 'TemplateBlogPage' },
    TEMPLATE_BLOGPOST_PAGE: { value: 'TemplateBlogPostPage' },
  },
});

export default TemplateName;
