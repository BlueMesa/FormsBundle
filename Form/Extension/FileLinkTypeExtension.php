<?php

/*
 * This file is part of the FormsBundle.
 *
 * Copyright (c) 2016 BlueMesa LabDB Contributors <labdb@bluemesa.eu>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */


namespace Bluemesa\Bundle\FormsBundle\Form\Extension;

use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Form\AbstractTypeExtension;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\FormView;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\PropertyAccess\PropertyAccess;
use Vich\UploaderBundle\Templating\Helper\UploaderHelper;

/**
 * Class FileLinkTypeExtension
 *
 * This class is a copy-and-paste from the Symfony Handbook
 * http://symfony.com/doc/current/form/create_form_type_extension.html
 *
 * @package Bluemesa\Bundle\FormsBundle\Form\Extension
 *
 * @DI\Service("bluemesa.forms.extension.filetypelink"))
 * @DI\Tag("form.type_extension",
 *     attributes = {"extended_type" = "Symfony\Component\Form\Extension\Core\Type\FileType"})
 */
class FileLinkTypeExtension extends AbstractTypeExtension
{
    /**
     * @var UploaderHelper
     */
    private $helper;

    /**
     * FileLinkTypeExtension constructor.
     *
     * @DI\InjectParams({"helper" = @DI\Inject("vich_uploader.templating.helper.uploader_helper")})
     *
     * @param  UploaderHelper  $helper
     */
    public function __construct(UploaderHelper $helper)
    {
        $this->helper = $helper;
    }


    /**
     * Returns the name of the type being extended.
     *
     * @return string The name of the type being extended
     */
    public function getExtendedType()
    {
        return FileType::class;
    }

    /**
     * Add the file_field option
     *
     * @param OptionsResolver $resolver
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefined(array('file_field'));
    }

    /**
     * Pass the image URL to the view
     *
     * @param FormView $view
     * @param FormInterface $form
     * @param array $options
     */
    public function buildView(FormView $view, FormInterface $form, array $options)
    {
        if (isset($options['file_field'])) {
            $entity = $form->getParent()->getData();
            $url = null;
            $name = null;
            if (null !== $entity) {
                try {
                    $url = $this->helper->asset($entity, $options['file_field']);
                } catch(\Exception $e) {}
                $accessor = PropertyAccess::createPropertyAccessor();
                $file = $accessor->getValue($entity, $options['file_field']);
                if ($file instanceof File) {
                    $name = $file->getFilename();
                }
            }
            $view->vars['file_url'] = $url;
            $view->vars['file_name'] = $name;
        }
    }
}
