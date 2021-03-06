<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace  UJM\ExoBundle\Command;

use Claroline\CoreBundle\Command\Traits\BaseCommandTrait;
use Claroline\CoreBundle\Entity\User;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\ConfirmationQuestion;

/**
 * Creates an user, optionaly with a specific role (default to simple user).
 */
class QuestionProprietaryUpdateCommand extends ContainerAwareCommand
{
    use BaseCommandTrait;

    private $params = [
        'new_owner' => 'The new owner username: ',
        'question_id' => 'The question id: ',
    ];

    protected function configure()
    {
        $this->setName('claroline:question:update_owner')
            ->setDescription('Update a question owner');
        $this->setDefinition(
            [
                new InputArgument('new_owner', InputArgument::REQUIRED, 'The new owner username'),
                new InputArgument('question_id', InputArgument::REQUIRED, 'The question id'),
            ]
        );
        $this->addOption(
            'all',
            'a',
            InputOption::VALUE_NONE,
            'When set to true, all question of the previous users will be updated'
        );
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $username = $input->getArgument('new_owner');
        $id = $input->getArgument('question_id');
        $container = $this->getContainer();
        $helper = $this->getHelper('question');
        $om = $container->get('claroline.persistence.object_manager');
        $newOwner = $om->getRepository('ClarolineCoreBundle:User')->loadUserByUsername($username);
        $question = $om->getRepository('UJM\ExoBundle\Entity\Question')->find($id);
        $all = $input->getOption('all');

        $questions = $all ?
           $om->getRepository('UJM\ExoBundle\Entity\Question')->findByUser($question->getUser()) :
           [$question];

        $output->writeln('Questions found:');

        foreach ($questions as $question) {
            $output->writeln("{$question->getTitle()} - {$question->getDescription()} - {$question->getUser()}");
        }

        $question = new ConfirmationQuestion('Do you want to update these questions ? y/n [y] ', true);

        if ($helper->ask($input, $output, $question)) {
            foreach ($questions as $question) {
                $question->setUser($newOwner);
                $om->persist($question);
            }
        }

        $output->writeln('Flushing...');
        $om->flush();
    }
}
